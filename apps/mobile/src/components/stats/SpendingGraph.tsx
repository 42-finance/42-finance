import { Feather } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransactions } from 'frontend-api'
import { getDailySpending, mapDateRangeToDate, valueChangeColor, valueChangeIcon } from 'frontend-utils'
import { formatDateInUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatDollarsSigned } from 'frontend-utils/src/invoice/invoice.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { customText, useTheme } from 'react-native-paper'
import { AccountType, CategoryType, DateRangeFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'

type Props = {
  dateRangeFilter?: DateRangeFilter
  widthReduction?: number
}

export const SpendingGraph: React.FC<Props> = ({ dateRangeFilter = DateRangeFilter.AllTime, widthReduction = 0 }) => {
  const { dark, colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [spendingOverride, setSpendingOverride] = useState<number | null>(null)
  const [spendingOnDate, setSpendingOnDate] = useState<number | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

  const filterStartDate = useMemo(() => mapDateRangeToDate(dateRangeFilter), [dateRangeFilter])

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: [ApiQuery.CashFlowTransactions, filterStartDate],
    queryFn: async () => {
      const res = await getTransactions({ startDate: filterStartDate })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetchTransactions)

  const expenseTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.category.group.type === CategoryType.Expense)
        .filter((t) => t.date.getTime() > filterStartDate.getTime()),
    [transactions]
  )

  const spendingTotal = useMemo(() => _.sumBy(expenseTransactions, 'convertedAmount'), [expenseTransactions])

  const dailySpending = useMemo(
    () => getDailySpending(expenseTransactions, filterStartDate, today),
    [expenseTransactions]
  )

  const spendingData = useMemo(() => {
    const data = dailySpending.map(({ value, date, dailyValue }) => ({ value, date, dailyValue }))
    if (data.length === 1) {
      data.push(data[0])
    }
    return data
  }, [dailySpending])

  const spendingValue = useMemo(() => spendingOverride ?? spendingTotal, [spendingData, spendingOverride])

  const spendingOnDateValue = useMemo(() => {
    if (spendingOnDate != null) {
      return {
        value: spendingOnDate,
        date: selectedEndDate
      }
    }
    return {
      value: spendingData[spendingData.length - 1]?.dailyValue ?? 0,
      date: today
    }
  }, [spendingOnDate, spendingData])

  const width = Dimensions.get('window').width

  const color = dark ? '#FFF' : colors.primary

  const Text = customText<'headlineMediumBold'>()

  return (
    <>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginTop: 15 }}>
        {formatDollarsSigned(spendingValue, currencyCode)}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5,
          marginBottom: 15
        }}
      >
        <Feather
          name={valueChangeIcon(spendingOnDateValue.value)}
          size={20}
          color={valueChangeColor(spendingOnDateValue.value, AccountType.Liability)}
          style={{ marginTop: 1, marginRight: 2 }}
        />
        <Text
          variant="bodyMedium"
          style={{
            color: valueChangeColor(spendingOnDateValue.value, AccountType.Liability)
          }}
          numberOfLines={1}
        >
          {formatDollars(spendingOnDateValue.value, currencyCode)}
        </Text>
        <Text variant="bodyMedium" style={{ marginLeft: 5, color: colors.outline }}>
          {selectedEndDate == null
            ? `${formatDateInUtc(filterStartDate, 'MMM d, yyyy')} - ${formatDateInUtc(today, 'MMM d, yyyy')}`
            : `${formatDateInUtc(filterStartDate, 'MMM d, yyyy')} - ${formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}`}
        </Text>
      </View>
      <View style={{ marginLeft: -10 }}>
        <LineChart
          initialSpacing={0}
          data={spendingData}
          hideDataPoints
          thickness={3}
          hideRules
          hideYAxisText
          hideAxesAndRules
          adjustToWidth
          width={width - widthReduction}
          color={color}
          startFillColor={color}
          endFillColor={color}
          startOpacity={0.5}
          endOpacity={0}
          areaChart
          pointerConfig={{
            radius: 10,
            pointerColor: color,
            pointerStripColor: color,
            pointerStripWidth: 3,
            pointerStripUptoDataPoint: true
          }}
          getPointerProps={({ pointerIndex }) => {
            if (pointerIndex === -1) {
              setSpendingOverride(null)
              setSelectedEndDate(null)
              setSpendingOnDate(null)
            } else {
              setSpendingOverride(spendingData[pointerIndex].value)
              setSelectedEndDate(spendingData[pointerIndex].date)
              setSpendingOnDate(spendingData[pointerIndex].dailyValue)
            }
          }}
          curved
          curveType={1}
        />
      </View>
    </>
  )
}

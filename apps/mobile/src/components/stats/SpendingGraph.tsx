import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransactions } from 'frontend-api'
import { groupTransactionsByDay, mapDateRangeFilterFull, mapDateRangeToDate } from 'frontend-utils'
import { formatDateInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollarsSigned } from 'frontend-utils/src/invoice/invoice.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { customText, useTheme } from 'react-native-paper'
import { CategoryType, DateRangeFilter } from 'shared-types'

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

  const [spendingOverride, setSpendingOverride] = useState<number | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)

  const filterStartDate = useMemo(() => mapDateRangeToDate(dateRangeFilter), [dateRangeFilter])

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: [ApiQuery.CashFlowTransactions],
    queryFn: async () => {
      const res = await getTransactions()
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

  const groupedTransactions = useMemo(() => groupTransactionsByDay(expenseTransactions), [expenseTransactions])

  const spendingByDay = useMemo(
    () =>
      groupedTransactions.map(({ key, transactions }) => ({
        date: key,
        value: _.sumBy(transactions, 'convertedAmount')
      })),
    [groupedTransactions]
  )

  const graphData = useMemo(() => spendingByDay.map(({ value }) => ({ value: Math.max(0, value) })), [spendingByDay])

  const spendingValue = useMemo(() => spendingOverride ?? spendingTotal, [spendingByDay, spendingOverride])

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
        <Text variant="bodyMedium" style={{ marginLeft: 5, color: colors.outline }}>
          {selectedEndDate == null
            ? mapDateRangeFilterFull(dateRangeFilter)
            : formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}
        </Text>
      </View>
      <View style={{ marginLeft: -10 }}>
        <LineChart
          initialSpacing={0}
          data={graphData}
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
            } else {
              setSpendingOverride(spendingByDay[pointerIndex].value)
              setSelectedEndDate(spendingByDay[pointerIndex].date)
            }
          }}
          curved
          curveType={1}
        />
      </View>
    </>
  )
}

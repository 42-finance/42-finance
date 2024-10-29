import { Feather } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { endOfDay, startOfDay } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Goal } from 'frontend-types'
import { calculateGoalProgress, getDailySpending, valueChangeColor, valueChangeIcon } from 'frontend-utils'
import { dateToLocal, dateToUtc, formatDateInUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatDollarsSigned } from 'frontend-utils/src/invoice/invoice.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { ProgressBar, Text, useTheme } from 'react-native-paper'
import { AccountType, CategoryType, GoalType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { View } from '../common/View'

type Props = {
  goal: Goal
}

export const GoalSpendingGraph: React.FC<Props> = ({ goal }) => {
  const { dark, colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [spendingOverride, setSpendingOverride] = useState<number | null>(null)
  const [spendingOnDate, setSpendingOnDate] = useState<number | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null)
  const [startDate] = useState(dateToUtc(startOfDay(dateToLocal(goal.startDate ?? today))))
  const [endDate] = useState(dateToUtc(endOfDay(dateToLocal(goal.targetDate ?? today))))

  const { data: transactions = [] } = useQuery({
    queryKey: [ApiQuery.GoalTransactions, goal.id],
    queryFn: async () => {
      const res = await getTransactions({
        accountIds: goal.accounts.map((a) => a.id),
        startDate,
        endDate
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.category.group.type === CategoryType.Expense),
    [transactions]
  )

  const spendingTotal = useMemo(() => _.sumBy(expenseTransactions, 'convertedAmount'), [expenseTransactions])

  const graphEndDate = useMemo(() => (endDate.getTime() > today.getTime() ? today : endDate), [endDate, today])

  const dailySpending = useMemo(
    () => getDailySpending(expenseTransactions, startDate, graphEndDate),
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
          color={valueChangeColor(spendingOnDateValue.value, AccountType.Liability, colors.outline)}
          style={{ marginTop: 1, marginRight: 2 }}
        />
        <Text
          variant="bodyMedium"
          style={{
            color: valueChangeColor(spendingOnDateValue.value, AccountType.Liability, colors.outline)
          }}
          numberOfLines={1}
        >
          {formatDollars(spendingOnDateValue.value, currencyCode)}
        </Text>
        <Text variant="bodyMedium" style={{ marginLeft: 5, color: colors.outline }}>
          {selectedEndDate == null
            ? `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(endDate, 'MMM d, yyyy')}`
            : `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}`}
        </Text>
      </View>
      <View style={{ flex: 1, padding: 15 }}>
        <ProgressBar
          progress={calculateGoalProgress(Math.abs(spendingOverride ?? spendingTotal), goal.amount, goal.type)}
          style={{
            borderRadius: 50,
            backgroundColor: colors.outline,
            marginVertical: 10,
            height: 8
          }}
          color="#19d2a5"
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="titleMedium">{formatDollars(spendingOverride ?? spendingTotal, currencyCode)}</Text>
          <Text variant="titleMedium">
            {goal.type === GoalType.Savings || goal.type === GoalType.Spending
              ? formatDollars(goal.amount, currencyCode)
              : formatDollars(0, currencyCode)}
          </Text>
        </View>
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
          width={width}
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

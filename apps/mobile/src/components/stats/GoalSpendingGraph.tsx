import { useQuery } from '@tanstack/react-query'
import { endOfDay, startOfDay } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Goal } from 'frontend-types'
import { calculateGoalProgress, groupTransactionsByDay } from 'frontend-utils'
import { dateToLocal, dateToUtc, formatDateInUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import { formatDollars, formatDollarsSigned } from 'frontend-utils/src/invoice/invoice.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Dimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType, GoalType } from 'shared-types'

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
            ? `${formatDateInUtc(startDate, 'MMM d, yyyy')} - ${formatDateInUtc(endDate, 'MMM d, yyyy')}`
            : formatDateInUtc(selectedEndDate, 'MMM d, yyyy')}
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
          data={graphData}
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

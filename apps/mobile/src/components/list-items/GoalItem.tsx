import { useQuery } from '@tanstack/react-query'
import { endOfDay, startOfDay } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Goal } from 'frontend-types'
import { calculateGoalProgress, formatDollars, todayInUtc } from 'frontend-utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType, GoalType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'

type Props = {
  goal: Goal
  onSelected: (goal: Goal) => void
  index?: number
  backgroundColor?: string
}

export const GoalItem = ({ goal, onSelected, index, backgroundColor }: Props) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())

  const { data: transactions = [] } = useQuery({
    queryKey: [ApiQuery.GoalTransactions, goal.id],
    queryFn: async () => {
      const res = await getTransactions({
        accountIds: goal.accounts.map((a) => a.id),
        startDate: startOfDay(goal.startDate ?? today),
        endDate: endOfDay(goal.targetDate ?? today)
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    enabled: goal.type === GoalType.Spending
  })

  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.category.group.type === CategoryType.Expense),
    [transactions]
  )

  const spendingTotal = useMemo(() => _.sumBy(expenseTransactions, 'convertedAmount'), [expenseTransactions])

  const total = useMemo(
    () =>
      goal.type === GoalType.Spending
        ? spendingTotal
        : goal.accounts.reduce((acc, account) => {
            return acc + account.convertedBalance
          }, 0),
    [goal]
  )

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(goal)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: backgroundColor ?? colors.elevation.level2
      }}
    >
      <>
        {index != null && index > 0 && <Divider style={{ height: 1, backgroundColor: '#082043' }} />}
        <View style={{ flex: 1, padding: 20 }}>
          <Text variant="titleLarge">{goal.name}</Text>
          <ProgressBar
            progress={calculateGoalProgress(total, goal.amount, goal.type)}
            style={{
              borderRadius: 50,
              backgroundColor: colors.outline,
              marginVertical: 10,
              height: 8
            }}
            color="#19d2a5"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="titleMedium">{formatDollars(total, currencyCode)}</Text>
            <Text variant="titleMedium">
              {goal.type === GoalType.Savings || goal.type === GoalType.Spending
                ? formatDollars(goal.amount, currencyCode)
                : formatDollars(0, currencyCode)}
            </Text>
          </View>
        </View>
      </>
    </TouchableOpacity>
  )
}

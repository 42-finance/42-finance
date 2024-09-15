import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ApiQuery, getBudgets, getTransactions } from 'frontend-api'
import {
  calculateBudgetAmount,
  calculateBudgetProgress,
  dateToUtc,
  formatDollars,
  formatDollarsSigned,
  mapCategoryType,
  mapCategoryTypeToColor
} from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { View } from '../common/View'

type Props = {
  type: CategoryType
  backgroundColor?: string
}

export const BudgetProgress: React.FC<Props> = ({ type, backgroundColor }) => {
  const { colors } = useTheme()

  const { data: budgets = [] } = useQuery({
    queryKey: [ApiQuery.Budgets],
    queryFn: async () => {
      const res = await getBudgets()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { data: transactions = [] } = useQuery({
    queryKey: [ApiQuery.BudgetTransactions],
    queryFn: async () => {
      const startDate = dateToUtc(startOfMonth(new Date()))
      const endDate = dateToUtc(endOfMonth(new Date()))
      const res = await getTransactions({ startDate, endDate })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const rolloverCategoryIds = useMemo(
    () => budgets.filter((b) => b.category.rolloverBudget).map((b) => b.categoryId),
    [budgets]
  )

  const { data: rolloverTransactions = [] } = useQuery({
    queryKey: [ApiQuery.BudgetRolloverTransactions],
    queryFn: async () => {
      const res = await getTransactions({ categoryIds: rolloverCategoryIds })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const isIncome = useMemo(() => type === CategoryType.Income, [type])

  const typeBudgets = useMemo(
    () =>
      budgets
        .filter((b) => b.category.group.type === type)
        .map((b) => ({ ...b, rolloverAmount: calculateBudgetAmount(b, rolloverTransactions, isIncome) })),
    [budgets, isIncome, rolloverTransactions, type]
  )

  const totalBudget = useMemo(() => _.sumBy(typeBudgets, 'rolloverAmount'), [typeBudgets])

  const typeTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.category.group.type === type)
        .map((t) => ({ ...t, convertedAmount: type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount })),
    [transactions, type]
  )

  const total = useMemo(() => _.sumBy(typeTransactions, 'convertedAmount'), [typeTransactions])

  return (
    <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor }}>
      <Text variant="titleMedium">{mapCategoryType(type)}</Text>
      <ProgressBar
        progress={calculateBudgetProgress(total, totalBudget)}
        style={{
          borderRadius: 50,
          backgroundColor: colors.outline,
          marginVertical: 10,
          height: 8
        }}
        color={mapCategoryTypeToColor(type)}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text variant="titleMedium" style={{ flex: 1 }}>
          {formatDollarsSigned(total, 0)}
        </Text>
        <Text variant="titleMedium">{formatDollars(totalBudget, 0)}</Text>
      </View>
    </View>
  )
}

import { Feather } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditBudgetRequest, editBudget, getTransactions } from 'frontend-api'
import { Budget, Category, Group, Transaction } from 'frontend-types'
import { calculateBudgetAmount, formatBudgetAmount, formatDollarsSigned } from 'frontend-utils'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { View } from '../common/View'
import { BudgetCategory } from './BudgetCategory'

type Props = {
  group: Group
  budgets: Budget[]
  transactions: Transaction[]
  editingCategoryId: number | null
  onCategoryPressed: (category: Category) => void
  onCategoryEdited: () => void
}

export const BudgetGroup: React.FC<Props> = ({
  group,
  budgets,
  transactions,
  onCategoryPressed,
  onCategoryEdited,
  editingCategoryId
}) => {
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [collapsed, setCollapsed] = useState(false)
  const [showUnbudgeted, setShowUnbudgeted] = useState(false)

  const groupRolloverCategoryIds = useMemo(
    () => group.categories.filter((c) => c.rolloverBudget).map((c) => c.id),
    [group]
  )

  const isIncome = useMemo(() => group.type === CategoryType.Income, [group])

  const { data: groupRolloverTransactions = [] } = useQuery({
    queryKey: [ApiQuery.BudgetGroupRolloverTransactions, groupRolloverCategoryIds],
    queryFn: async () => {
      if (groupRolloverCategoryIds.length === 0) {
        return []
      }
      const res = await getTransactions({ categoryIds: groupRolloverCategoryIds })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const groupBudgets = useMemo(
    () =>
      budgets
        .filter((b) => b.category.groupId === group.id)
        .map((b) => ({ ...b, rolloverAmount: calculateBudgetAmount(b, groupRolloverTransactions, isIncome) })),
    [budgets, group.id, groupRolloverTransactions, isIncome]
  )

  const totalBudget = useMemo(() => _.sumBy(groupBudgets, 'amount'), [groupBudgets])

  const totalRolloverBudget = useMemo(() => _.sumBy(groupBudgets, 'rolloverAmount'), [groupBudgets])

  const groupTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.category.groupId === group.id)
        .map((t) => ({ ...t, convertedAmount: isIncome ? -t.convertedAmount : t.convertedAmount })),
    [transactions, group, isIncome]
  )

  const totalSpent = useMemo(() => _.sumBy(groupTransactions, 'convertedAmount'), [groupTransactions])

  const budgetedCategories = useMemo(
    () => group.categories.filter((c) => !c.hideFromBudget && groupBudgets.find((b) => b.categoryId === c.id)),
    [group, groupBudgets]
  )

  const unbudgetedCategories = useMemo(
    () => group.categories.filter((c) => !c.hideFromBudget && !groupBudgets.find((b) => b.categoryId === c.id)),
    [group, groupBudgets]
  )

  const unbudgetedTransactions = useMemo(
    () =>
      transactions
        .filter((t) => unbudgetedCategories.find((c) => c.id === t.categoryId))
        .map((t) => ({ ...t, convertedAmount: isIncome ? -t.convertedAmount : t.convertedAmount })),
    [transactions, unbudgetedCategories, isIncome]
  )

  const unbudgetedAmount = useMemo(() => _.sumBy(unbudgetedTransactions, 'convertedAmount'), [unbudgetedTransactions])

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: EditBudgetRequest) => {
      Keyboard.dismiss()
      const res = await editBudget(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Budgets] })
        onCategoryEdited()
      }
    }
  })

  const onPress = useCallback(
    (category: Category) => {
      onCategoryPressed(category)
    },
    [onCategoryPressed]
  )

  const onEdit = useCallback(
    (category: Category, amount: number) => {
      mutate({
        categoryId: category.id,
        amount
      })
    },
    [mutate]
  )

  return (
    <View key={group.id}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          paddingHorizontal: 15,
          paddingVertical: 20,
          alignItems: 'center',
          backgroundColor: colors.elevation.level2
        }}
      >
        <TouchableOpacity onPress={() => setCollapsed((collapsed) => !collapsed)}>
          <Feather name={collapsed ? 'chevron-up' : 'chevron-down'} size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text variant="titleMedium" style={{ flex: 1, marginStart: 8 }}>
          {group.name}
        </Text>
        <Text variant="titleSmall" style={{ textAlign: 'right' }}>
          {formatBudgetAmount(totalRolloverBudget, totalBudget)}
        </Text>
        <Text variant="titleSmall" style={{ width: 90, textAlign: 'right' }}>
          {formatDollarsSigned(totalRolloverBudget - totalSpent, 0)}
        </Text>
      </View>
      {!collapsed && (
        <>
          {budgetedCategories.map((category) => (
            <BudgetCategory
              key={category.id}
              group={group}
              category={category}
              budgets={budgets}
              transactions={transactions}
              onPress={onPress}
              onEdit={onEdit}
              isEditing={editingCategoryId === category.id}
              isLoading={isPending}
            />
          ))}
          {showUnbudgeted && (
            <>
              {unbudgetedCategories.map((category) => (
                <BudgetCategory
                  key={category.id}
                  group={group}
                  category={category}
                  budgets={budgets}
                  transactions={transactions}
                  onPress={onPress}
                  onEdit={onEdit}
                  isEditing={editingCategoryId === category.id}
                  isLoading={isPending}
                />
              ))}
            </>
          )}
          {unbudgetedCategories.length > 0 && (
            <>
              <Divider />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.elevation.level2,
                  paddingHorizontal: 15,
                  paddingVertical: 20
                }}
                onPress={() => setShowUnbudgeted(!showUnbudgeted)}
              >
                <Feather name="eye" size={20} color={colors.outline} style={{ marginLeft: 2 }} />
                <Text variant="bodyMedium" style={{ flex: 1, marginStart: 10, color: colors.outline }}>
                  {showUnbudgeted ? 'Hide' : 'Show'} {unbudgetedCategories.length} unbudgeted
                </Text>
                <Text variant="titleSmall">{formatDollarsSigned(0 - unbudgetedAmount, 0)}</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  )
}

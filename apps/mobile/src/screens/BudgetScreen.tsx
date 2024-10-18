import { Feather } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ApiQuery, getBudgets, getGroups, getTransactions } from 'frontend-api'
import { dateToUtc } from 'frontend-utils'
import { mapCategoryType } from 'frontend-utils/src/mappers/map-category-type'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { Category } from '../../../../libs/frontend-types/src/category.type'
import { BudgetGroup } from '../components/budget/BudgetGroup'
import { BudgetProgress } from '../components/budget/BudgetProgress'
import { View } from '../components/common/View'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const BudgetScreen = ({ navigation }: RootStackScreenProps<'Budget'>) => {
  const { colors } = useTheme()

  const [editCategory, setEditCategory] = useState<Category | null>(null)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  const {
    data: groups = [],
    isFetching: fetching,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const {
    data: budgets = [],
    isFetching: fetchingBudgets,
    refetch: refetchBudgets
  } = useQuery({
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

  useRefetchOnFocus(refetchBudgets)

  const {
    data: transactions = [],
    isFetching: fetchingTransactions,
    refetch: refetchTransactions
  } = useQuery({
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

  useRefetchOnFocus(refetchTransactions)

  const incomeGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Income), [groups])

  const expenseGroups = useMemo(() => groups.filter((g) => g.type === CategoryType.Expense), [groups])

  const budgetGroups = useMemo(
    () => [
      { type: CategoryType.Income, groups: incomeGroups },
      { type: CategoryType.Expense, groups: expenseGroups }
    ],
    [incomeGroups, expenseGroups]
  )

  const renderHeader = (title: string) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 40, paddingHorizontal: 15, alignItems: 'center' }}>
        <Text variant="titleMedium" style={{ flex: 1 }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.outline, width: 90, textAlign: 'right' }}>
          Budget
        </Text>
        <Text variant="bodySmall" style={{ color: colors.outline, width: 90, textAlign: 'right' }}>
          Remaining
        </Text>
      </View>
    )
  }

  return (
    <View>
      <ProgressBar indeterminate visible={fetching || fetchingBudgets || fetchingTransactions} />
      <ScrollView>
        <BudgetProgress type={CategoryType.Income} backgroundColor={colors.elevation.level2} />
        <Divider />
        <BudgetProgress type={CategoryType.Expense} backgroundColor={colors.elevation.level2} />
        {budgetGroups.map(({ type, groups }) => (
          <View key={type}>
            {renderHeader(mapCategoryType(type))}
            {groups
              .filter((group) => !group.hideFromBudget)
              .map((group) => (
                <BudgetGroup
                  key={group.id}
                  group={group}
                  budgets={budgets}
                  transactions={transactions}
                  onCategoryPressed={(category) => {
                    if (editCategory?.id === category.id) {
                      setEditCategory(null)
                    } else {
                      setEditCategory(category)
                    }
                  }}
                  onCategoryEdited={() => {
                    setEditCategory(null)
                  }}
                  editingCategoryId={editCategory?.id ?? null}
                />
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

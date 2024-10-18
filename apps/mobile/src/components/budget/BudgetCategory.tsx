import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Budget, Category, Group, Transaction } from 'frontend-types'
import {
  calculateBudgetAmount,
  dateToUtc,
  formatBudgetAmount,
  formatDollars,
  formatDollarsSigned,
  groupTransactionsByMonth
} from 'frontend-utils'
import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import MaskInput from 'react-native-mask-input'
import { Button, Divider, Text, TextInput, useTheme } from 'react-native-paper'
import { CategoryType, ReportDateFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { dollarMask } from '../../utils/mask.utils'
import { ActivityIndicator } from '../common/ActivityIndicator'
import { View } from '../common/View'

type Props = {
  group: Group
  category: Category
  budgets: Budget[]
  transactions: Transaction[]
  onPress: (category: Category) => void
  onEdit: (category: Category, amount: number) => void
  isEditing: boolean
  isLoading: boolean
}

export const BC: React.FC<Props> = ({
  group,
  category,
  budgets,
  transactions,
  onPress,
  onEdit,
  isEditing,
  isLoading
}) => {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const { currencyCode } = useUserTokenContext()

  const [amount, setAmount] = useState('')

  const isIncome = useMemo(() => group.type === CategoryType.Income, [group])

  const categoryBudget = useMemo(() => budgets.find((b) => b.categoryId === category.id), [budgets, category])

  const categoryTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.categoryId === category.id)
        .map((t) => ({ ...t, convertedAmount: isIncome ? -t.convertedAmount : t.convertedAmount })),
    [transactions, category, isIncome]
  )

  const totalSpent = useMemo(() => _.sumBy(categoryTransactions, 'convertedAmount'), [categoryTransactions])

  const { data: allCategoryTransactions = [] } = useQuery({
    queryKey: [ApiQuery.BudgetCategoryTransactions, category.id],
    queryFn: async () => {
      const res = await getTransactions({ categoryIds: [category.id] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const budgetAmount = useMemo(() => categoryBudget?.amount ?? 0, [categoryBudget])

  const rolloverBudgetAmount = useMemo(
    () => (categoryBudget ? calculateBudgetAmount(categoryBudget, allCategoryTransactions, isIncome) : 0),
    [categoryBudget, allCategoryTransactions, isIncome]
  )

  const monthlyAverage = useMemo(() => {
    const transactionsExcludingThisMonth = allCategoryTransactions.filter(
      (t) => t.date < dateToUtc(startOfMonth(new Date()))
    )
    const transactionsByMonth = groupTransactionsByMonth(transactionsExcludingThisMonth)
    if (transactionsByMonth.length === 0) return 0
    const totalAmount = _.sumBy(transactionsExcludingThisMonth, 'convertedAmount')
    return totalAmount / transactionsByMonth.length
  }, [allCategoryTransactions])

  const lastMonthAmount = useMemo(() => {
    const lastMonth = subMonths(new Date(), 1)
    const lastMonthTransactions = allCategoryTransactions.filter(
      (t) => t.date >= dateToUtc(startOfMonth(lastMonth)) && t.date <= dateToUtc(endOfMonth(lastMonth))
    )
    const transactionsByMonth = groupTransactionsByMonth(lastMonthTransactions)
    if (transactionsByMonth.length === 0) return 0
    const totalAmount = _.sumBy(lastMonthTransactions, 'convertedAmount')
    return totalAmount / transactionsByMonth.length
  }, [allCategoryTransactions])

  useEffect(() => {
    setAmount(budgetAmount.toString())
  }, [budgetAmount])

  return (
    <View>
      <TouchableOpacity onPress={() => onPress(category)}>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            paddingVertical: 20,
            alignItems: 'center',
            backgroundColor: colors.elevation.level2
          }}
        >
          <Text variant="titleMedium" style={{ flex: 1 }}>
            {category.icon}
            {'  '}
            {category.name}
          </Text>
          <Text variant="titleSmall" style={{ width: 90, textAlign: 'right' }}>
            {formatBudgetAmount(rolloverBudgetAmount, budgetAmount, currencyCode)}
          </Text>
          <Text variant="titleSmall" style={{ width: 90, textAlign: 'right' }}>
            {formatDollarsSigned(rolloverBudgetAmount - totalSpent, currencyCode, 0)}
          </Text>
        </View>
      </TouchableOpacity>
      {isEditing && (
        <View style={{ backgroundColor: colors.background, padding: 10 }}>
          <View style={{ position: 'relative' }}>
            <TextInput
              keyboardType="number-pad"
              value={amount}
              onChangeText={(value) => setAmount(value)}
              right={
                !isLoading && (
                  <TextInput.Icon
                    icon="check"
                    onPress={() => {
                      onEdit(category, Number(amount))
                    }}
                    forceTextInputFocus={false}
                  />
                )
              }
              render={(props) => (
                <MaskInput
                  {...props}
                  onChangeText={(_masked, unmasked) => setAmount(unmasked)}
                  mask={dollarMask(currencyCode)}
                />
              )}
            />
            {isLoading && <ActivityIndicator style={{ position: 'absolute', right: 16, top: 15 }} />}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="bodySmall" style={{ color: colors.outline, marginTop: 5, flex: 1 }}>
              Monthly average {formatDollars(monthlyAverage, currencyCode, 0)}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.outline, marginTop: 5 }}>
              Last month {formatDollars(lastMonthAmount, currencyCode, 0)}
            </Text>
          </View>
          <Button
            mode="contained"
            style={{ marginTop: 8 }}
            onPress={() =>
              navigation.navigate('Category', { categoryId: category.id, dateFilter: ReportDateFilter.Monthly })
            }
          >
            View Category
          </Button>
        </View>
      )}
    </View>
  )
}

export const BudgetCategory = memo(BC)

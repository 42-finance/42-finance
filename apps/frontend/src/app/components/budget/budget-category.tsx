import { IconButton, InputAdornment, TextField } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Budget, Category, Group, Transaction } from 'frontend-types'
import { dateToUtc, formatDollars, formatDollarsSigned, groupTransactionsByMonth, lightColors } from 'frontend-utils'
import _ from 'lodash'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { CategoryType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/currency-input'

type Props = {
  group: Group
  category: Category
  budgets: Budget[]
  transactions: Transaction[]
  onPress: (category: Category) => void
  onEdit: (category: Category, amount: number) => void
  isEditing: boolean
}

export const BC: React.FC<Props> = ({ group, category, budgets, transactions, onPress, onEdit, isEditing }) => {
  const { currencyCode } = useUserTokenContext()

  const [amount, setAmount] = useState('')

  const isIncome = useMemo(() => group.type === CategoryType.Income, [group])

  const categoryBudget = useMemo(() => budgets.find((b) => b.categoryId === category.id), [budgets, category])

  const budgetAmount = useMemo(() => categoryBudget?.amount ?? 0, [categoryBudget])

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
    <div>
      <div className="cursor-pointer" onClick={() => onPress(category)}>
        <div className="border-t" />
        <div className="flex items-center px-4 py-5">
          <div className="grow">
            {category.icon}
            {'  '}
            {category.name}
          </div>
          <div className="" style={{ width: 90, textAlign: 'right' }}>
            {formatDollars(budgetAmount, currencyCode, 0)}
          </div>
          <div className="" style={{ width: 90, textAlign: 'right' }}>
            {formatDollarsSigned(budgetAmount - totalSpent, currencyCode, 0)}
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="px-3 pb-3">
          <div className="flex">
            <TextField
              variant="filled"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              InputProps={{
                inputComponent: CurrencyInput as any,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        onEdit(category, Number(amount))
                      }}
                      edge="end"
                    >
                      <FaCheck size={20} className="mr-2" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              fullWidth
              hiddenLabel
            />
          </div>

          <div className="flex mt-1">
            <div className="bodySmall" style={{ color: lightColors.outline, marginTop: 5, flex: 1 }}>
              Monthly average {formatDollars(monthlyAverage, currencyCode, 0)}
            </div>
            <div className="bodySmall" style={{ color: lightColors.outline, marginTop: 5 }}>
              Last month {formatDollars(lastMonthAmount, currencyCode, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const BudgetCategory = memo(BC)

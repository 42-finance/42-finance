import { differenceInMonths } from 'date-fns'
import { Budget, Transaction } from 'frontend-types'
import _ from 'lodash'

import { todayInUtc } from '../date/date.utils'
import { formatDollars } from '../invoice/invoice.utils'

export const calculateBudgetProgress = (spent: number, budget: number) => {
  if (budget === 0) {
    return spent > 0 ? 1 : 0
  }
  return Math.min(Math.max(spent / budget, 0), 1)
}

export const calculateBudgetAmount = (budget: Budget, transactions: Transaction[], isIncome: boolean) => {
  if (!budget.category.rolloverBudget) {
    return budget.amount
  }

  const startDate = new Date('2024-04-01')
  const today = todayInUtc()
  const months = differenceInMonths(today, startDate) + 1
  if (months <= 1) {
    return budget.amount
  }

  const filteredTransactions = transactions
    .filter((t) => t.categoryId === budget.categoryId && t.date.getTime() >= startDate.getTime())
    .sort((t1, t2) => t1.date.getTime() - t2.date.getTime())
    .map((t) => ({ ...t, convertedAmount: isIncome ? -t.convertedAmount : t.convertedAmount }))

  if (filteredTransactions.length === 0) {
    return budget.amount
  }

  const totalAmount = budget.amount * months
  const totalSpent = _.sumBy(filteredTransactions, 'convertedAmount')
  return totalAmount - totalSpent
}

export const formatBudgetAmount = (totalRolloverBudget: number, totalBudget: number) => {
  if (totalRolloverBudget === totalBudget) {
    return formatDollars(totalBudget, 0)
  }

  return `${formatDollars(totalRolloverBudget, 0)} (${formatDollars(totalBudget, 0)}/m)`
}

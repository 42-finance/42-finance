import { addMonths, differenceInMonths, endOfMonth } from 'date-fns'
import { Account } from 'frontend-types'
import { GoalType } from 'shared-types'

import { dateToUtc, todayInUtc } from '../date/date.utils'

export const calculateGoalProgress = (total: number, target: number, type: GoalType) => {
  if (type === GoalType.Savings) {
    if (target === 0) {
      return 0
    }
    return Math.min(Math.max(total / target, 0), 1)
  } else {
    if (total === 0) {
      return 0
    }
    return Math.min(Math.max((target - total) / total, 0), 1)
  }
}

export const calculateGoalBudgetAmount = (
  targetDate: Date | null,
  type: GoalType,
  accounts: Account[],
  amount: number
) => {
  if (targetDate == null) {
    return null
  }
  const today = todayInUtc()
  const numberOfMonths = differenceInMonths(dateToUtc(targetDate), today) + 1
  if (type === GoalType.Savings) {
    const accountsValue = accounts.reduce((acc, account) => acc + account.convertedBalance, 0)
    return (amount - accountsValue) / numberOfMonths
  } else {
    return amount / numberOfMonths
  }
}

export const calculateGoalTargetDate = (
  budgetAmount: number | null,
  type: GoalType,
  accounts: Account[],
  amount: number
) => {
  if (budgetAmount == null || budgetAmount === 0) {
    return null
  }
  const accountsValue = accounts.reduce((acc, account) => acc + account.convertedBalance, 0)
  const amountRemaining = type === GoalType.Savings ? amount - accountsValue : accountsValue
  const numberOfMonths = Math.ceil(amountRemaining / budgetAmount)
  const today = todayInUtc()
  return dateToUtc(endOfMonth(addMonths(today, numberOfMonths)))
}

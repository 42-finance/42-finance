import { Expense } from 'database'
import { Frequency } from 'shared-types'

export const calculateExpenseMonthly = (expense: Expense) => {
  switch (expense.frequency) {
    // case Frequency.Once:
    //   return expense.amount / 12
    case Frequency.Weekly:
      return (expense.amount * 52) / 12
    case Frequency.BiWeekly:
      return (expense.amount * 26) / 12
    // case Frequency.Monthly:
    //   return expense.amount
    default:
      return expense.amount
  }
}

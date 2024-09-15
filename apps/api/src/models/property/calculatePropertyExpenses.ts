import { Property } from 'database'
import { getYear } from 'date-fns'

import { roundDollars } from '../../utils/number.utils'
import { calculateExpenseMonthly } from '../expense/calculateExpenseMonthly'

export const calculatePropertyExpenses = (property: Property) => {
  const year = getYear(new Date())
  return roundDollars(
    property.expenses.reduce((totalExpenses, expense) => {
      // if (expense.frequency === Frequency.Once && getYear(expense.dateOfFirstOccurence) !== year) {
      //   return totalExpenses
      // }

      return totalExpenses + calculateExpenseMonthly(expense)
    }, 0)
  )
}

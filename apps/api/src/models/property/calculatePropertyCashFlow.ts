import { Property } from 'database'

import { roundDollars } from '../../utils/number.utils'
import { calculatePropertyExpenses } from './calculatePropertyExpenses'
import { calculatePropertyRent } from './calculatePropertyRent'

export const calculatePropertyCashFlow = (property: Property) => {
  const rent = calculatePropertyRent(property)
  const expenses = calculatePropertyExpenses(property)
  return roundDollars(rent - expenses)
}

import { Property } from 'database'
import { roundDollars } from '../../utils/number.utils'

export const calculatePropertyRent = (property: Property) =>
  roundDollars(property.rentalUnits.reduce((totalRent, rentalUnit) => totalRent + rentalUnit.rent, 0))

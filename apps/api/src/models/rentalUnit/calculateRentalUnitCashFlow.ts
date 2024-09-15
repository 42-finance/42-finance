import { RentalUnit } from 'database'

export const calculateRentalUnitCashFlow = (rentalUnit: RentalUnit) => {
  const expenses = 0
  const maintenance = 0
  return rentalUnit.rent - expenses - maintenance
}

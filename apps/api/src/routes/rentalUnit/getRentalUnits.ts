import { dataSource, Property, RentalUnit } from 'database'
import { Request, Response } from 'express'
import { calculateRentalUnitCashFlow } from '../../models/rentalUnit/calculateRentalUnitCashFlow'
import { calculateRentalUnitTenantCount } from '../../models/rentalUnit/calculateRentalUnitTenantCount'

export default async (request: Request, response: Response) => {
  const userId = request.userId

  const rentalUnits = await dataSource
    .getRepository(RentalUnit)
    .createQueryBuilder('rentalUnit')
    .leftJoin(Property, 'property', 'property.id = rentalUnit.propertyId')
    .where('property.landlordId = :userId', { userId })
    .getMany()

  for (const rentalUnit of rentalUnits) {
    rentalUnit.tenantCount = calculateRentalUnitTenantCount(rentalUnit)
    rentalUnit.totalRent = rentalUnit.rent
    rentalUnit.totalExpenses = 0
    rentalUnit.totalMaintenance = 0
    rentalUnit.cashFlow = calculateRentalUnitCashFlow(rentalUnit)
  }

  response.send(rentalUnits)
}

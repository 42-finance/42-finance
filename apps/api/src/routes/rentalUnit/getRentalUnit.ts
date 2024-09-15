import { dataSource, Invoice, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { calculateRentalUnitCashFlow } from '../../models/rentalUnit/calculateRentalUnitCashFlow'
import { calculateRentalUnitTenantCount } from '../../models/rentalUnit/calculateRentalUnitTenantCount'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const rentalUnit = await dataSource
    .getRepository(RentalUnit)
    .createQueryBuilder('rentalUnit')
    .leftJoinAndMapMany('rentalUnit.invoices', Invoice, 'invoice', 'invoice.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapOne('invoice.property', Property, 'invoiceProperty', 'invoice.propertyId = invoiceProperty.id')
    .leftJoinAndMapOne(
      'invoice.rentalUnit',
      RentalUnit,
      'invoiceRentalUnit',
      'invoice.rentalUnitId = invoiceRentalUnit.id'
    )
    .leftJoin(Property, 'property', 'property.id = rentalUnit.propertyId')
    .leftJoinAndMapMany('rentalUnit.tenants', Tenant, 'tenant', 'tenant.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapOne('tenant.user', User, 'user', 'tenant.userId = user.id')
    .where('rentalUnit.id = :id', { id })
    .andWhere('property.landlord.id = :userId', { userId })
    .addOrderBy('invoice.date', 'DESC')
    .getOne()

  if (!rentalUnit) {
    return response.status(404).json({
      errors: [`Tenant group with id: ${id} was not found`],
      payload: {}
    })
  }

  rentalUnit.tenantCount = calculateRentalUnitTenantCount(rentalUnit)
  rentalUnit.totalRent = rentalUnit.rent
  rentalUnit.totalExpenses = 0
  rentalUnit.totalMaintenance = 0
  rentalUnit.cashFlow = calculateRentalUnitCashFlow(rentalUnit)

  return response.json({
    errors: [],
    payload: rentalUnit
  })
}

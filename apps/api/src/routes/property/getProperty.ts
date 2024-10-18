import { dataSource, Expense, Invoice, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import { isNil } from 'lodash'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { calculatePropertyCashFlow } from '../../models/property/calculatePropertyCashFlow'
import { calculatePropertyExpenses } from '../../models/property/calculatePropertyExpenses'
import { calculatePropertyRent } from '../../models/property/calculatePropertyRent'
import { calculatePropertyTenantCount } from '../../models/property/calculatePropertyTenantCount'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const property = await dataSource
    .getRepository(Property)
    .createQueryBuilder('property')
    .leftJoinAndMapMany('property.rentalUnits', RentalUnit, 'rentalUnit', 'rentalUnit.propertyId = property.id')
    .leftJoinAndMapMany('rentalUnit.invoices', Invoice, 'invoice', 'invoice.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapMany('rentalUnit.tenants', Tenant, 'tenant', 'tenant.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapOne('tenant.user', User, 'user', 'user.id = tenant.userId')
    .leftJoinAndMapMany('property.expenses', Expense, 'expense', 'expense.propertyId = property.id')
    .where('property.id = :id', { id })
    .andWhere('(tenant.userId = :userId OR property.landlordId = :userId)', { userId })
    .addOrderBy('invoice.date')
    .getOne()

  if (!property) {
    return response.status(404).json({
      errors: [`A property with id: ${id} was not found`],
      payload: {}
    })
  }

  property.tenantCount = calculatePropertyTenantCount(property)
  property.totalRent = calculatePropertyRent(property)
  property.totalExpenses = calculatePropertyExpenses(property)
  property.cashFlow = calculatePropertyCashFlow(property)

  for (const rentalUnit of property.rentalUnits) {
    rentalUnit.nextRentInvoice =
      rentalUnit.invoices.find((i) => isNil(i.transactionId)) ?? rentalUnit.invoices[rentalUnit.invoices.length - 1]
  }

  return response.json({
    errors: [],
    payload: property
  })
}

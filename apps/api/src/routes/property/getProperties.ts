import { dataSource, Expense, Invoice, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { calculatePropertyCashFlow } from '../../models/property/calculatePropertyCashFlow'
import { calculatePropertyExpenses } from '../../models/property/calculatePropertyExpenses'
import { calculatePropertyRent } from '../../models/property/calculatePropertyRent'
import { calculatePropertyTenantCount } from '../../models/property/calculatePropertyTenantCount'

export default async (request: Request<{}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const userId = request.userId

  const properties = await dataSource
    .getRepository(Property)
    .createQueryBuilder('property')
    .leftJoinAndMapMany('property.rentalUnits', RentalUnit, 'rentalUnit', 'rentalUnit.propertyId = property.id')
    .leftJoinAndMapOne('rentalUnit.invoices', Invoice, 'invoice', 'invoice.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapMany('rentalUnit.tenants', Tenant, 'tenant', 'tenant.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapOne('tenant.user', User, 'user', 'user.id = tenant.userId')
    .leftJoinAndMapMany('property.expenses', Expense, 'expense', 'expense.propertyId = property.id')
    .where('(tenant.userId = :userId OR property.landlordId = :userId)', { userId })
    .addOrderBy('property.nickname')
    .addOrderBy('property.address')
    .addOrderBy('invoice.date', 'DESC')
    .getMany()

  for (const property of properties) {
    property.isLandlord = property.landlordId === userId
    property.tenantCount = calculatePropertyTenantCount(property)
    property.totalRent = calculatePropertyRent(property)
    property.totalExpenses = calculatePropertyExpenses(property)
    property.cashFlow = calculatePropertyCashFlow(property)
  }

  response.json({
    errors: [],
    payload: properties,
    metadata: {
      count: properties.length
    }
  })
}

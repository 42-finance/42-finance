import { dataSource, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const tenant = await dataSource
    .getRepository(Tenant)
    .createQueryBuilder('tenant')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = tenant.rentalUnitId')
    .leftJoin(Property, 'property', 'property.id = rentalUnit.propertyId')
    .leftJoinAndMapOne('tenant.user', User, 'user', 'user.id = tenant.userId')
    .where('tenant.id = :id', { id })
    .andWhere('(tenant.userId = :userId OR property.landlordId = :userId)', { userId })
    .getOne()

  if (!tenant) {
    return response.status(404).json({
      errors: [`Tenant with id ${id} was not found`],
      payload: {}
    })
  }

  return response.json({
    errors: [],
    payload: tenant
  })
}

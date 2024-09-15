import { dataSource, Property, RentalUnit, Tenant } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const tenantRepo = dataSource.getRepository(Tenant)
  const tenant = await tenantRepo
    .createQueryBuilder('tenant')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = tenant.rentalUnitId')
    .leftJoin(Property, 'property', 'property.id = rentalUnit.propertyId')
    .where('tenant.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()

  if (!tenant) {
    return response.status(404).json({
      errors: [`Tenant with id: ${id} was not found`],
      payload: {}
    })
  }

  try {
    const result = await tenantRepo.remove(tenant)
    return response.json({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error],
      payload: {}
    })
  }
}

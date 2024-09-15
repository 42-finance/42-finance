import { dataSource, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { HTTPRequestQuery } from '../../models/http/httpRequestQuery'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { useQueryOptions } from '../../models/query/useQueryOptions'

export default async (request: Request<{}, {}, {}, HTTPRequestQuery>, response: Response<HTTPResponseBody>) => {
  const userId = request.userId
  const { filters } = useQueryOptions(Tenant, request.query)

  let tenantsQuery = dataSource
    .getRepository(Tenant)
    .createQueryBuilder('tenant')
    .leftJoinAndMapOne('tenant.rentalUnit', RentalUnit, 'rentalUnit', 'rentalUnit.id = tenant.rentalUnitId')
    .leftJoinAndMapOne('rentalUnit.property', Property, 'property', 'property.id = rentalUnit.propertyId')
    .leftJoinAndMapOne('property.landlord', User, 'landlord', 'landlord.id = property.landlordId')

  if (filters['tenant.userOnly'] === 'true') {
    tenantsQuery.andWhere('tenant.userId = :userId', { userId })
  } else {
    tenantsQuery.andWhere('(tenant.userId = :userId OR property.landlordId = :userId)', { userId })
  }

  delete filters['tenant.userOnly']

  tenantsQuery = Object.keys(filters).reduce(
    (query, filterKey) =>
      _.isArray(filters[filterKey])
        ? query.andWhere(`${filterKey} IN (:...${filterKey})`, {
            [filterKey]: filters[filterKey]
          })
        : query.andWhere(`${filterKey} = :${filterKey}`, {
            [filterKey]: filters[filterKey]
          }),
    tenantsQuery
  )

  const tenants = await tenantsQuery.getMany()

  return response.json({
    errors: [],
    payload: tenants,
    metadata: {
      total: tenants.length
    }
  })
}

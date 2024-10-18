import { dataSource, RentalUnit } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { QueryError } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (
  request: Request<{ id: number }, {}, { name: string; rent: number }>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { name, rent } = request.body
  const userId = request.userId

  const rentalUnit = await dataSource
    .getRepository(RentalUnit)
    .createQueryBuilder('rentalUnit')
    .leftJoin('property', 'property', 'property.id = rentalUnit.propertyId')
    .where('rentalUnit.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()

  if (!rentalUnit) {
    return response.status(404).json({
      errors: [`Rental unit not found`],
      payload: {}
    })
  }

  dataSource.transaction(async (entityManager) => {
    let updatedRentalUnit: RentalUnit

    try {
      updatedRentalUnit = await entityManager.getRepository(RentalUnit).save(
        _.assign({}, rentalUnit, {
          name,
          rent
        })
      )
    } catch (error: any) {
      return error.code === QueryError.UniqueConstraintViolation
        ? response.status(409).json({
            errors: [`Rental unit with name ${name} already exists`],
            payload: {}
          })
        : response.status(500).json({
            errors: [error.message],
            payload: {}
          })
    }

    return response.json({
      errors: [],
      payload: updatedRentalUnit
    })
  })
}

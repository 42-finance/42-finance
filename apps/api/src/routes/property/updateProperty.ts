import { dataSource, Property } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { QueryError } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (
  request: Request<{ id: number }, {}, Partial<Property>>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { nickname } = request.body
  const userId = request.userId

  const propertyRepo = dataSource.getRepository(Property)
  const property = await propertyRepo
    .createQueryBuilder('property')
    .where('property.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()

  if (!property) {
    return response.status(404).json({
      errors: [`Property with id: ${id} was not found`],
      payload: {}
    })
  }

  try {
    const updatedProperty = await propertyRepo.save({
      ...property,
      ...request.body,
      nickname: _.isEmpty(nickname) ? null : nickname
    })
    return response.json({
      errors: [],
      payload: updatedProperty
    })
  } catch (error: any) {
    return error.code === QueryError.UniqueConstraintViolation
      ? response.status(409).json({
          errors: [`Property with nickname: ${nickname} already exists`],
          payload: {}
        })
      : response.status(500).json({
          errors: [error.message],
          payload: {}
        })
  }
}

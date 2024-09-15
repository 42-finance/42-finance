import { dataSource, Property, User } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { QueryError } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import validateFields from '../helpers/validateFields'

export default async (request: Request<{}, {}, Partial<Property>>, response: Response<HTTPResponseBody>) => {
  const { nickname } = request.body
  const userId = request.userId

  const validationErrors = validateFields(
    {
      required: ['address', 'city', 'territory', 'country', 'postalCode'],
      nullable: ['nickname']
    },
    request.body
  )
  if (!_.isEmpty(validationErrors)) {
    return response.status(400).json({
      errors: validationErrors,
      payload: {}
    })
  }

  const user = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', { userId: userId })
    .getOne()
  if (!user) {
    return response.status(403).json({
      errors: [`Unauthorized to create property`],
      payload: {}
    })
  }

  await dataSource.transaction(async (entityManager) => {
    let property: Property

    try {
      property = await entityManager.getRepository(Property).save({
        ...request.body,
        nickname: _.isEmpty(nickname) ? null : nickname,
        landlordId: user.id
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

    return response.json({
      errors: [],
      payload: _.assign(property)
    })
  })
}

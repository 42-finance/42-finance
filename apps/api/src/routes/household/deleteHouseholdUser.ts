import { Boom } from '@hapi/boom'
import { HouseholdUser, dataSource } from 'database'
import { Request, Response } from 'express'
import { UserPermission } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteHouseholdUser = async (request: Request<{ id: number }>, response: Response<HTTPResponseBody>) => {
  const { householdId, userId: authUserId } = request
  const { id } = request.params

  console.log(id, authUserId, householdId)

  if (Number(id) === Number(authUserId)) {
    throw new Boom('Cannot remove yourself from the household', { statusCode: 409 })
  }

  const householdUser = await dataSource
    .getRepository(HouseholdUser)
    .createQueryBuilder('householdUser')
    .where('householdUser.userId = :userId', { userId: id })
    .where('householdUser.householdId = :householdId', { householdId })
    .getOneOrFail()

  if (householdUser.permission === UserPermission.Owner) {
    throw new Boom('Cannot remove the owner from the household', { statusCode: 409 })
  }

  const result = await dataSource
    .getRepository(HouseholdUser)
    .createQueryBuilder()
    .delete()
    .where('userId = :userId', { userId: id })
    .andWhere('householdId = :householdId', { householdId })
    .execute()

  return response.json({
    errors: [],
    payload: result
  })
}

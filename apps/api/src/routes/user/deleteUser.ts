import { Connection, Household, HouseholdUser, User, dataSource } from 'database'
import { Request, Response } from 'express'
import { UserPermission } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { deletePlaidConnection } from '../../utils/connection.utils'

export default async (request: Request, response: Response<HTTPResponseBody>) => {
  const { userId } = request

  const households = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .leftJoin(HouseholdUser, 'householdUser', 'householdUser.householdId = household.id')
    .leftJoinAndMapMany('household.connections', Connection, 'connection', 'connection.householdId = household.id')
    .where('householdUser.userId = :userId', { userId })
    .andWhere('householdUser.permission = :permission', { permission: UserPermission.Owner })
    .getMany()

  return await dataSource.transaction(async (entityManager) => {
    for (const household of households) {
      for (const connection of household.connections) {
        await deletePlaidConnection(connection, false, entityManager)
      }
    }

    const householdIds = households.map((h) => h.id)
    if (householdIds.length > 0) {
      await entityManager.getRepository(Household).softDelete(householdIds)
    }

    const result = await entityManager.getRepository(User).delete(userId)

    return response.json({
      errors: [],
      payload: result
    })
  })
}

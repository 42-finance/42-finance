import { HouseholdUser, User, UserInvite, dataSource } from 'database'
import { Request, Response } from 'express'
import { UserPermission } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getHouseholdUsers = async (request: Request, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request

  const householdUsers = await dataSource
    .getRepository(HouseholdUser)
    .createQueryBuilder('householdUser')
    .leftJoinAndMapOne('householdUser.user', User, 'user', 'user.id = householdUser.userId')
    .where('householdUser.householdId = :householdId', { householdId })
    .getMany()

  const invitedUsers = await dataSource
    .getRepository(UserInvite)
    .createQueryBuilder('userInvite')
    .where('userInvite.householdId = :householdId', { householdId })
    .getMany()

  const allUsers = [
    ...householdUsers.map((u) => ({
      ...u,
      canDelete: u.userId !== userId && u.permission !== UserPermission.Owner
    })),
    ...invitedUsers.map((u) => ({
      email: u.email,
      householdId: u.householdId,
      permission: u.permission,
      canDelete: true
    }))
  ]

  return response.json({
    errors: [],
    payload: allUsers
  })
}

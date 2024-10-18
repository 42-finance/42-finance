import { Boom } from '@hapi/boom'
import { HouseholdUser, User, dataSource } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { UserPermission } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { sendUserInvite } from '../../services/userInvite/sendUserInvite'
import validateFields from '../helpers/validateFields'

type InviteUserRequest = {
  email: string
  permission: UserPermission
}

export const createUserInvite = async (
  request: Request<object, object, InviteUserRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { email, permission } = request.body

  const validationErrors = validateFields(
    {
      required: ['email', 'permission']
    },
    request.body
  )
  if (!_.isEmpty(validationErrors)) {
    return response.status(400).json({
      errors: validationErrors,
      payload: {}
    })
  }

  const existingHouseholdUser = await dataSource
    .getRepository(HouseholdUser)
    .createQueryBuilder('householdUser')
    .leftJoin(User, 'user', 'user.id = householdUser.userId')
    .where('householdUser.householdId = :householdId', { householdId })
    .andWhere('user.email = :email', { email })
    .getOne()

  if (existingHouseholdUser) {
    throw new Boom('This user is already a member of this household', { statusCode: 409 })
  }

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  await sendUserInvite(email, householdId, user, permission)

  return response.json({
    errors: [],
    payload: 'Invitation sent'
  })
}

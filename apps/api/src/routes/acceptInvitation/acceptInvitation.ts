import { Boom } from '@hapi/boom'
import bcrypt from 'bcryptjs'
import { HouseholdUser, User, UserInvite, dataSource } from 'database'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'
import { UserPermission } from 'shared-types'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getUserByEmail } from '../../models/user/getUserByEmail'
import { createDefaultNotifications } from '../../utils/notification.utils'
import { verifyJwt } from '../../utils/token.utils'

type UpdateInviteRequest = {
  token: string
  name: string
  email: string
  password: string
}

type InviteTokenPayload = {
  householdId: number
  permission: UserPermission
  email: string
}

export const acceptInvitation = async (
  request: Request<object, object, UpdateInviteRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { token, name, email, password } = request.body

  const decodedToken = verifyJwt<InviteTokenPayload>(token, config.auth.tokenSecret)

  if (decodedToken.email !== email) {
    throw new Boom('Invitation email does not match user email', { statusCode: 409 })
  }

  const user = await getUserByEmail(decodedToken.email)

  if (user) {
    throw new Boom('An account already exists with this email', { statusCode: 409 })
  }

  const invite = await dataSource
    .getRepository(UserInvite)
    .findOneOrFail({ where: { email: decodedToken.email, householdId: decodedToken.householdId } })

  if (!invite) {
    throw new Boom('This invitation has been revoked', { statusCode: 409 })
  }

  return await dataSource.transaction(async (entityManager) => {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await entityManager.getRepository(User).save({ email, name, passwordHash, emailConfirmed: true })
    await createDefaultNotifications(user.id, entityManager)

    await entityManager.getRepository(HouseholdUser).save({
      userId: user.id,
      householdId: invite.householdId,
      permission: invite.permission
    })

    await entityManager
      .getRepository(UserInvite)
      .createQueryBuilder()
      .delete()
      .where('householdId = :householdId', { householdId: invite.householdId })
      .andWhere('email = :email', { email: user.email })
      .execute()

    const token = jwt.sign({ householdId: invite.householdId, userId: user.id }, config.auth.tokenSecret)

    return response.json({
      errors: [],
      payload: {
        token,
        user: omit(user, ['passwordHash'])
      }
    })
  })
}

import { Household, HouseholdUser, User, UserInvite, dataSource } from 'database'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import verifyAppleToken from 'verify-apple-id-token'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { createHousehold } from '../../utils/household.utils'
import { createDefaultNotifications } from '../../utils/notification.utils'

type LoginWithAppleRequest = {
  identityToken: string
  name: string
}

export const loginWithApple = async (
  request: Request<object, object, LoginWithAppleRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { identityToken, name } = request.body

  const { email } = await verifyAppleToken({
    idToken: identityToken,
    clientId: [
      'com.rentyapps.renty',
      'com.rentyapps.renty.preview',
      'com.rentyapps.renty.development',
      'com.fortytwofinance.app',
      'com.fortytwofinance.app.preview',
      'com.fortytwofinance.app.development',
      'com.fortytwofinance.web'
    ]
  })

  let user = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('LOWER(user.email) = :email', { email: email.toLowerCase() })
    .getOne()

  if (!user || !user.emailConfirmed) {
    await dataSource.transaction(async (entityManager) => {
      user = await entityManager.getRepository(User).save({ email, name, emailConfirmed: true })
      await createDefaultNotifications(user.id, entityManager)
      await createHousehold(user, entityManager)
    })
  }

  const invitations = await dataSource
    .getRepository(UserInvite)
    .find({ where: { email }, relations: ['invitedByUser'] })

  const households = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .leftJoin(HouseholdUser, 'householdUser', 'householdUser.householdId = household.id')
    .where('householdUser.userId = :userId', { userId: user!.id })
    .getMany()

  const token = jwt.sign(
    { userId: user!.id, householdId: households.length > 0 ? households[0].id : undefined },
    process.env.TOKEN_SECRET as string
  )

  return response.json({
    errors: [],
    payload: {
      token,
      user: _.omit(user, ['passwordHash']),
      invitations,
      currencyCode: user!.currencyCode
    }
  })
}

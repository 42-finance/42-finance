import { Boom } from '@hapi/boom'
import { HouseholdUser, User, dataSource } from 'database'
import { Request, Response } from 'express'
import { UserPermission } from 'shared-types'
import stripe from 'stripe'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreatePortalRequest = {}

export const createPortal = async (
  request: Request<object, object, CreatePortalRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const householdOwner = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .leftJoin(HouseholdUser, 'householdUser', 'householdUser.userId = user.id')
    .andWhere('householdUser.householdId = :householdId', { householdId })
    .andWhere('householdUser.permission = :permission', { permission: UserPermission.Owner })
    .getOneOrFail()

  if (householdOwner.id !== user.id) {
    throw new Boom('Only the household owner can manage subscriptions', { statusCode: 409 })
  }

  if (!user.stripeCustomerId) {
    throw new Boom('No stripe customer for user', { statusCode: 409 })
  }

  const stripeClient = new stripe(config.stripe.secret)

  const session = await stripeClient.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${config.frontend.appUrl}/settings?setting=subscription`
  })

  console.log(session)

  return response.json({
    errors: [],
    payload: {
      url: session.url
    }
  })
}

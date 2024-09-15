import { Boom } from '@hapi/boom'
import { HouseholdUser, User, dataSource } from 'database'
import { Request, Response } from 'express'
import { SubscriptionType, UserPermission } from 'shared-types'
import stripe from 'stripe'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateCheckoutRequest = {
  subscriptionType: SubscriptionType
}

export const createCheckout = async (
  request: Request<object, object, CreateCheckoutRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { subscriptionType } = request.body

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

  const stripeClient = new stripe(config.stripe.secret)

  if (!user.stripeCustomerId) {
    const customer = await stripeClient.customers.create({
      name: user.name,
      email: user.email
    })
    user.stripeCustomerId = customer.id
    await dataSource.getRepository(User).update(user.id, { stripeCustomerId: customer.id })
  }

  const prices = await stripeClient.prices.list({
    lookup_keys: [subscriptionType],
    expand: ['data.product']
  })

  const session = await stripeClient.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel'
        }
      },
      trial_period_days: 30
    },
    mode: 'subscription',
    success_url: `${config.frontend.appUrl}/settings?setting=subscription&success=true`,
    cancel_url: `${config.frontend.appUrl}/settings?setting=subscription`,
    customer: user.stripeCustomerId
  })

  return response.json({
    errors: [],
    payload: {
      url: session.url
    }
  })
}

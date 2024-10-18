import { Boom } from '@hapi/boom'
import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import { SubscriptionType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getStripeSubscription, stripeClient } from '../../utils/stripe.utils'

type UpdateSubscriptionRequest = {
  newSubscriptionType: SubscriptionType
}

export const updateSubscription = async (
  request: Request<object, object, UpdateSubscriptionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { newSubscriptionType } = request.body

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  if (!user.stripeCustomerId) {
    throw new Boom('No stripe customer for user', { statusCode: 403 })
  }

  const { subscriptionType, subscription, invoice, platform } = await getStripeSubscription(householdId)

  if (!subscription || !subscriptionType || !invoice) {
    throw new Boom(`You have no active subscription.`, { statusCode: 409 })
  }

  if (platform !== 'stripe') {
    throw new Boom('Subscription is not managed by stripe', { statusCode: 403 })
  }

  if (newSubscriptionType === subscriptionType) {
    throw new Boom('This is already the active subscription type', { statusCode: 403 })
  }

  const item = subscription?.items.data[0]

  const prices = await stripeClient.prices.list({
    lookup_keys: [newSubscriptionType],
    expand: ['data.product']
  })

  await stripeClient.subscriptionItems.update(item.id, { price: prices.data[0].id })

  return response.json({
    errors: [],
    payload: 'Subscription has been updated'
  })
}

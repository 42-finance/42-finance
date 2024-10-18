import { Request, Response } from 'express'
import { StripeSubscription } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getStripeSubscription } from '../../utils/stripe.utils'

export const getSubscription = async (request: Request, response: Response<HTTPResponseBody<StripeSubscription>>) => {
  const { householdId } = request

  const { subscriptionType, renewalDate, invoice, platform } = await getStripeSubscription(householdId)

  return response.json({
    errors: [],
    payload: {
      subscriptionType,
      renewalDate,
      invoice: invoice
        ? {
            date: new Date(invoice.period_end * 1000),
            amount: invoice.total / 100,
            currency: invoice.currency
          }
        : null,
      platform
    }
  })
}

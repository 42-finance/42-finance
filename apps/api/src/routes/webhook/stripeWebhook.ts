import { Request, Response } from 'express'

type StripeWebhookRequest = {
  data: {
    object: {
      customer: string
    }
  }
  type: string
}

export const stripeWebhook = async (request: Request<object, object, StripeWebhookRequest>, response: Response) => {
  const {
    type,
    data: {
      object: { customer }
    }
  } = request.body

  console.log(type, customer)

  if (type === 'customer.subscription.deleted') {
    console.log(`Stripe customer ${customer} subscription has ended`)
  }

  return response.send()
}

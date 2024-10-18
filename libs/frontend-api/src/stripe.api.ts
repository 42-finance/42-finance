import { StripeSubscription, SubscriptionType } from 'shared-types'

import { config } from './config'
import { get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

type CreateCheckoutRequest = {
  subscriptionType: SubscriptionType
}

type CreateCheckoutResponse = {
  url: string
}

export const createCheckout = async (body: CreateCheckoutRequest) =>
  post<HTTPResponseBody<CreateCheckoutResponse>>(`${config.apiUrl}/stripe/checkout`, body)

type CreatePortalResponse = {
  url: string
}

export const createPortal = async () =>
  post<HTTPResponseBody<CreatePortalResponse>>(`${config.apiUrl}/stripe/portal`, {})

export const getSubscription = async () =>
  get<HTTPResponseBody<StripeSubscription>>(`${config.apiUrl}/stripe/subscription`)

type UpdateSubscriptionRequest = {
  newSubscriptionType: SubscriptionType
}

export const updateSubscription = async (body: UpdateSubscriptionRequest) =>
  patch<HTTPResponseBody<any>>(`${config.apiUrl}/stripe/subscription`, body)

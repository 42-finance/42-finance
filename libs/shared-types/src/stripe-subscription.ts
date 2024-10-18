import { SubscriptionType } from './enums/subscription-type'

export type StripeSubscription = {
  subscriptionType: SubscriptionType | null
  renewalDate: Date | null
  invoice: {
    date: Date
    amount: number
    currency: string
  } | null
  platform: string
}

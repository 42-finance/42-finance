import { SubscriptionType } from 'shared-types'

export const mapSubscriptionType = (subscriptionType: SubscriptionType) => {
  switch (subscriptionType) {
    case SubscriptionType.UnlimitedConnections:
      return 'Unlimited Connections'
    case SubscriptionType.UnlimitedConnectionsYearly:
      return 'Unlimited Connections - Annual'
  }
}

export const mapSubscriptionTypeToPrice = (subscriptionType: SubscriptionType) => {
  switch (subscriptionType) {
    case SubscriptionType.UnlimitedConnections:
      return 4.99
    case SubscriptionType.UnlimitedConnectionsYearly:
      return 39.99
  }
}

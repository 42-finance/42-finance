import { Connection, Household, HouseholdUser, User, dataSource } from 'database'
import { SubscriptionType, UserPermission } from 'shared-types'
import stripe from 'stripe'

import { config } from '../common/config'

export const stripeClient = new stripe(config.stripe.secret)

export const getStripeSubscription = async (householdId: number) => {
  const household = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .andWhere('household.id = :householdId', { householdId })
    .getOneOrFail()

  const activeConnections = await getActiveConnections(householdId)

  if (household.subscriptionOverride) {
    return {
      subscriptionType: household.subscriptionOverride,
      renewalDate: null,
      invoice: null,
      activeConnections,
      platform: 'override'
    }
  }

  const householdOwner = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .leftJoin(HouseholdUser, 'householdUser', 'householdUser.userId = user.id')
    .andWhere('householdUser.householdId = :householdId', { householdId })
    .andWhere('householdUser.permission = :permission', { permission: UserPermission.Owner })
    .getOneOrFail()

  const subResponse = await fetch(`https://api.revenuecat.com/v1/subscribers/${householdOwner.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.revenueCat.secret}`
    }
  })
  const subData = await subResponse.json()
  const entitlements = subData.subscriber?.entitlements ?? {}
  const entitlement =
    entitlements[SubscriptionType.UnlimitedConnections] ??
    entitlements[SubscriptionType.UnlimitedConnectionsYearly] ??
    null
  if (entitlement) {
    const subscriptionType = entitlement.product_identifier.replace('_dev', '') as SubscriptionType
    const renewalDate = new Date(entitlement.expires_date)
    const now = new Date()
    if (renewalDate.getTime() > now.getTime()) {
      return {
        subscriptionType,
        renewalDate,
        invoice: null,
        activeConnections,
        platform: 'ios'
      }
    }
  }

  const subscription = await getActiveSubscription(householdOwner)
  const subscriptionItem = subscription?.items.data[0]
  const stripeSubscriptionType = subscriptionItem?.price.lookup_key as SubscriptionType
  const invoice = await getInvoice(householdOwner)

  return {
    subscriptionType: stripeSubscriptionType,
    renewalDate: invoice ? new Date(invoice.period_end * 1000) : null,
    invoice,
    subscription,
    activeConnections,
    platform: 'stripe'
  }
}

const getActiveConnections = (householdId: number) =>
  dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .andWhere('connection.householdId = :householdId', { householdId })
    .getCount()

const getRemovedConnections = (householdId: number, upcomingInvoice: stripe.UpcomingInvoice | null) => {
  let query = dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .andWhere('connection.householdId = :householdId', { householdId })
    .withDeleted()

  if (upcomingInvoice) {
    query = query.andWhere('connection.deletedAt >= :startDate', {
      startDate: new Date(upcomingInvoice.period_start * 1000)
    })
  }

  return query.getCount()
}

const getActiveSubscription = async (user: User) => {
  if (!user.stripeCustomerId) {
    return null
  }

  try {
    const { data: subscriptions } = await stripeClient.subscriptions.list({
      customer: user.stripeCustomerId
    })
    return subscriptions[0]
  } catch {
    return null
  }
}

const getInvoice = async (user: User) => {
  if (!user.stripeCustomerId) {
    return null
  }

  try {
    return await stripeClient.invoices.retrieveUpcoming({
      customer: user.stripeCustomerId
    })
  } catch {
    return null
  }
}

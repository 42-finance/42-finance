import { FontAwesome5 } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ApiQuery, getSubscription } from 'frontend-api'
import { formatDollars, mapSubscriptionType, setMessage } from 'frontend-utils'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { Linking, ScrollView } from 'react-native'
import { Avatar, Button, Card, Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { CurrencyCode } from 'shared-types'

import { View } from '../common/View'

export const SubscriptionIos = () => {
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null)

  const { data: subscription, isFetching } = useQuery({
    queryKey: [ApiQuery.StripeSubscription],
    queryFn: async () => {
      const res = await getSubscription()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: packages = [], isFetching: fetchingOfferings } = useQuery({
    queryKey: [ApiQuery.SubscriptionOfferings],
    queryFn: async () => {
      const offerings = await Purchases.getOfferings()
      const packages = offerings.current?.availablePackages ?? []
      setSelectedPackage(packages[0])
      return packages
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (selectedPackage === null) {
        setMessage('Select a subscription')
        return
      }
      await Purchases.purchasePackage(selectedPackage)
      queryClient.invalidateQueries({ queryKey: [ApiQuery.StripeSubscription] })
    }
  })

  const { mutate: restoreMutation, isPending: pendingRestore } = useMutation({
    mutationFn: async () => {
      await Purchases.restorePurchases()
      queryClient.invalidateQueries({ queryKey: [ApiQuery.StripeSubscription] })
    }
  })

  const subscribedPackage = useMemo(
    () => packages.find((p) => p.identifier === subscription?.subscriptionType),
    [packages, subscription]
  )

  const formatNextPayment = () => {
    if (!subscription || !subscribedPackage) return ''
    let str = formatDollars(Math.max(0, subscribedPackage.product.price), CurrencyCode.USD)
    if (subscription.renewalDate) {
      str += ` on ${format(subscription.renewalDate, 'MMMM dd, yyyy')}`
    }
    return str
  }

  const onPrivacy = () => {
    Linking.openURL('https://app.42f.io/privacy')
  }

  const onTerms = () => {
    Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula')
  }

  const formatPrice = (purchasePackage: PurchasesPackage) => {
    if (purchasePackage.identifier === 'connection_unlimited_yearly') {
      return `${formatDollars(purchasePackage.product.price, CurrencyCode.USD)} / year`
    }
    return `${formatDollars(purchasePackage.product.price, CurrencyCode.USD)} / month`
  }

  if (!subscription || fetchingOfferings) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ paddingBottom: 80 }}>
        <ProgressBar indeterminate visible={isFetching || fetchingOfferings} />
        <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
          <Text variant="bodySmall" style={{ color: colors.outline, marginBottom: 15 }}>
            SUBSCRIPTION
          </Text>
        </View>
        {subscribedPackage && subscription.platform === 'ios' ? (
          <View>
            <View style={{ backgroundColor: colors.elevation.level2, padding: 15 }}>
              <Text variant="titleMedium" style={{ color: colors.outline }}>
                Plan
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 5 }}>
                {subscribedPackage.product.title}
              </Text>
            </View>
            <Divider />
            <View style={{ backgroundColor: colors.elevation.level2, padding: 15 }}>
              <Text variant="titleMedium" style={{ color: colors.outline }}>
                Next Payment
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 5 }}>
                {formatNextPayment()}
              </Text>
            </View>
            <Button
              mode="contained"
              style={{ marginTop: 15, marginHorizontal: 5 }}
              onPress={() => {
                Linking.openURL('https://apps.apple.com/account/subscriptions')
              }}
            >
              Manage Subscription
            </Button>
          </View>
        ) : subscription.subscriptionType ? (
          <View>
            <View style={{ backgroundColor: colors.elevation.level2, padding: 15 }}>
              <Text variant="titleMedium" style={{ color: colors.outline }}>
                Plan
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 5 }}>
                {mapSubscriptionType(subscription.subscriptionType)}
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 5, color: colors.outline }}>
                Manage your subscription via the web app
              </Text>
            </View>
            {subscription.invoice && (
              <>
                <Divider />
                <View style={{ backgroundColor: colors.elevation.level2, padding: 15 }}>
                  <Text variant="titleMedium" style={{ color: colors.outline }}>
                    Next Payment
                  </Text>
                  <Text variant="titleMedium" style={{ marginTop: 5 }}>
                    {subscription.invoice.currency.toUpperCase()}{' '}
                    {formatDollars(Math.max(0, subscription.invoice.amount), CurrencyCode.USD)} on{' '}
                    {format(subscription.invoice.date, 'MMMM dd, yyyy')}
                  </Text>
                </View>
              </>
            )}
          </View>
        ) : (
          <View>
            <Text variant="titleLarge" style={{ marginBottom: 15, marginStart: 15 }}>
              Select a plan
            </Text>
            <Text variant="bodyMedium" style={{ marginBottom: 15, marginStart: 15 }}>
              Select a subscription to connect a financial institution and take full advantage of 42 Finance's features.
            </Text>
            {packages.map((p) => (
              <Card
                key={p.identifier}
                style={{ marginHorizontal: 5, marginTop: 5 }}
                mode={selectedPackage?.identifier === p.identifier ? 'contained' : 'elevated'}
                onPress={() => setSelectedPackage(p)}
              >
                <Card.Content>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium">{p.product.title}</Text>
                      <Text variant="bodyMedium">1 month free then, {formatPrice(p)}</Text>
                    </View>
                    {selectedPackage?.identifier === p.identifier && (
                      <Avatar.Icon
                        size={24}
                        icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
            <Button
              mode="contained"
              style={{ marginTop: 15, marginHorizontal: 5 }}
              onPress={() => mutate()}
              disabled={isPending || pendingRestore}
              loading={isPending}
            >
              Purchase Subscription
            </Button>
            <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 5 }}>
              <Button onPress={() => restoreMutation()} loading={pendingRestore} disabled={isPending || pendingRestore}>
                Restore Purchase
              </Button>
              <View style={{ flex: 1 }} />
              <Button onPress={onTerms}>Terms</Button>
              <Button onPress={onPrivacy}>Privacy</Button>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

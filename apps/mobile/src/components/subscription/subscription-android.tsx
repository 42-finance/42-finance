import { FontAwesome5 } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ApiQuery, getSubscription } from 'frontend-api'
import { formatDollars, mapSubscriptionType, useUserTokenContext } from 'frontend-utils'
import * as React from 'react'
import { useState } from 'react'
import { Linking, ScrollView } from 'react-native'
import { Avatar, Button, Card, Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { SubscriptionType } from 'shared-types'

import { config } from '../../common/config'
import { View } from '../common/View'

export const SubscriptionAndroid = () => {
  const { colors } = useTheme()
  const { token, currencyCode } = useUserTokenContext()

  const [selectedPackage, setSelectedPackage] = useState<SubscriptionType>(SubscriptionType.UnlimitedConnections)

  const { data: subscription, isFetching } = useQuery({
    queryKey: [ApiQuery.StripeSubscription],
    queryFn: async () => {
      const res = await getSubscription()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  if (!subscription) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <ScrollView>
      <ProgressBar indeterminate visible={isFetching} />
      <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
        <Text variant="bodySmall" style={{ color: colors.outline, marginBottom: 15 }}>
          SUBSCRIPTION
        </Text>
      </View>
      {subscription.subscriptionType ? (
        <View>
          <View style={{ backgroundColor: colors.elevation.level2, padding: 15 }}>
            <Text variant="titleMedium" style={{ color: colors.outline }}>
              Plan
            </Text>
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              {mapSubscriptionType(subscription.subscriptionType)}
            </Text>
          </View>
          <Divider />
          {subscription.invoice && (
            <View style={{ backgroundColor: colors.elevation.level2, padding: 15 }}>
              <Text variant="titleMedium" style={{ color: colors.outline }}>
                Next Payment
              </Text>
              <Text variant="titleMedium" style={{ marginTop: 5 }}>
                {subscription.invoice.currency.toUpperCase()} {formatDollars(Math.max(0, subscription.invoice.amount))}{' '}
                on {format(subscription.invoice.date, 'MMMM dd, yyyy')}
              </Text>
            </View>
          )}
          <Button
            mode="contained"
            style={{ marginTop: 15, marginHorizontal: 5 }}
            onPress={() => {
              Linking.openURL(
                `${config.appUrl}/settings?setting=subscription&token=${token}&currencyCode=${currencyCode}`
              )
            }}
          >
            Manage Subscription
          </Button>
        </View>
      ) : (
        <View>
          <Text variant="titleLarge" style={{ marginBottom: 15, marginStart: 15 }}>
            Select a plan
          </Text>
          <Text variant="bodyMedium" style={{ marginBottom: 15, marginStart: 15 }}>
            Select a subscription to connect a financial institution and take full advantage of 42 Finance's features.
          </Text>
          <Card
            style={{ marginHorizontal: 5, marginTop: 5 }}
            mode={selectedPackage === SubscriptionType.UnlimitedConnections ? 'contained' : 'elevated'}
            onPress={() => setSelectedPackage(SubscriptionType.UnlimitedConnections)}
          >
            <Card.Content>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium">Unlimited Connections - Monthly</Text>
                  <Text variant="bodyMedium">1 month free then, USD $4.99 / month</Text>
                </View>
                {selectedPackage === SubscriptionType.UnlimitedConnections && (
                  <Avatar.Icon
                    size={24}
                    icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </View>
            </Card.Content>
          </Card>
          <Card
            style={{ marginHorizontal: 5, marginTop: 5 }}
            mode={selectedPackage === SubscriptionType.UnlimitedConnectionsYearly ? 'contained' : 'elevated'}
            onPress={() => setSelectedPackage(SubscriptionType.UnlimitedConnectionsYearly)}
          >
            <Card.Content>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium">Unlimited Connections - Annual</Text>
                  <Text variant="bodyMedium">1 month free then, USD $39.99 / year</Text>
                </View>
                {selectedPackage === SubscriptionType.UnlimitedConnectionsYearly && (
                  <Avatar.Icon
                    size={24}
                    icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </View>
            </Card.Content>
          </Card>
          <Button
            mode="contained"
            style={{ marginTop: 15, marginHorizontal: 5 }}
            onPress={() => {
              Linking.openURL(
                `${config.appUrl}/settings?setting=subscription&token=${token}&currencyCode=${currencyCode}&package=${selectedPackage}`
              )
            }}
          >
            Purchase Subscription
          </Button>
        </View>
      )}
    </ScrollView>
  )
}

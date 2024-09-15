import * as React from 'react'
import { Platform } from 'react-native'

import { SubscriptionAndroid } from '../components/subscription/subscription-android'
import { SubscriptionIos } from '../components/subscription/subscription-ios'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SubscriptionScreen: React.FC<RootStackScreenProps<'Subscription'>> = () => {
  return Platform.OS === 'ios' ? <SubscriptionIos /> : <SubscriptionAndroid />
}

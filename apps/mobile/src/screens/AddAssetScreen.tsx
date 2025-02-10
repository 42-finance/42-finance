import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { ApiQuery, getLinkToken } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { Platform } from 'react-native'
import { useTheme } from 'react-native-paper'
import { create } from 'react-native-plaid-link-sdk/dist/PlaidLink'
import { PlaidProduct } from 'shared-types'

import { AddAccountCard } from '../components/account/AddAccountCard'
import { View } from '../components/common/View'
import { usePlaid } from '../hooks/use-plaid.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddAssetScreen = ({ navigation }: RootStackScreenProps<'AddAsset'>) => {
  const { dark, colors } = useTheme()
  const queryClient = useQueryClient()
  const { openLink } = usePlaid()

  const { mutate, isPending } = useMutation({
    mutationFn: async (product: PlaidProduct) => {
      const res = await getLinkToken({ product, platform: Platform.OS })
      if (res.ok && res.parsedBody?.payload) {
        const data = res.parsedBody.payload
        if (data.linkToken) {
          create({ token: data.linkToken })
          openLink(
            () => {},
            () => {
              queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
              queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
              queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
              queryClient.invalidateQueries({ queryKey: [ApiQuery.StripeSubscription] })
              navigation.pop()
            }
          )
        } else {
          setMessage('You have reached your connection limit. Purchase a subscription to connect more institutions.')
        }
      }
    }
  })

  return (
    <View style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row' }}>
        <AddAccountCard
          onPress={() => mutate(PlaidProduct.Transactions)}
          text="Banks & Credit Cards"
          icon={
            <Image
              style={{
                width: 75,
                height: 24,
                tintColor: dark ? 'white' : undefined
              }}
              source={require('../assets/images/plaid.png')}
              contentFit="contain"
            />
          }
          disabled={isPending}
        />
        <AddAccountCard
          onPress={() => mutate(PlaidProduct.Investments)}
          text="Investments"
          icon={
            <Image
              style={{
                width: 75,
                height: 24,
                tintColor: dark ? 'white' : undefined
              }}
              source={require('../assets/images/plaid.png')}
              contentFit="contain"
            />
          }
          disabled={isPending}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <AddAccountCard
          onPress={() => navigation.navigate('AddCrypto')}
          text="Crypto"
          icon={<FontAwesome5 name="bitcoin" size={24} color={colors.onSurface} />}
          disabled={isPending}
        />
        <AddAccountCard
          onPress={() => navigation.navigate('AddVehicle')}
          text="Vehicle"
          icon={<FontAwesome6 name="car-side" size={24} color={colors.onSurface} />}
          disabled={isPending}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <AddAccountCard
          onPress={() => navigation.navigate('AddProperty')}
          text="Property"
          icon={<FontAwesome name="home" size={24} color={colors.onSurface} />}
          disabled={isPending}
        />
        <AddAccountCard
          onPress={() => navigation.navigate('AddAccount')}
          text="Manual Account"
          icon={<AntDesign name="arrowup" size={24} color={colors.onSurface} />}
          disabled={isPending}
        />
      </View>
    </View>
  )
}

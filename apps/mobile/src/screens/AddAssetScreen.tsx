import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Image } from 'expo-image'
import { ApiQuery, getFinicityConnectUrl, getMxConnectUrl } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTheme } from 'react-native-paper'

import { AddAccountCard } from '../components/account/AddAccountCard'
import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { View } from '../components/common/View'
import { usePlaid } from '../hooks/use-plaid.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddAssetScreen = ({ navigation }: RootStackScreenProps<'AddAsset'>) => {
  const { dark, colors } = useTheme()
  const queryClient = useQueryClient()
  const { createLink, openLink, loading, connectionLimitReached } = usePlaid()

  const [showPlaid, setShowPlaid] = useState(false)

  const { mutate: mxConnectUrlMutation, isPending: isLoadingMxConnectUrl } = useMutation({
    mutationFn: async () => {
      const res = await getMxConnectUrl()
      if (res.ok && res.parsedBody?.payload) {
        navigation.navigate('ConnectMx', { connectUrl: res.parsedBody.payload })
      }
    }
  })

  const { mutate: finicityConnectUrlMutation, isPending: isLoadingFinicityConnectUrl } = useMutation({
    mutationFn: async () => {
      const res = await getFinicityConnectUrl()
      if (res.ok && res.parsedBody?.payload) {
        navigation.navigate('ConnectFinicity', { connectUrl: res.parsedBody.payload })
      }
    }
  })

  useEffect(() => {
    if (!showPlaid) {
      createLink()
    }
  }, [createLink, showPlaid])

  return (
    <View style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row' }}>
        <AddAccountCard
          onPress={() => {
            if (connectionLimitReached) {
              setMessage(
                'You have reached your connection limit. Purchase a subscription to connect more institutions.'
              )
            } else {
              setShowPlaid(true)
              openLink(
                () => {
                  setShowPlaid(false)
                },
                () => {
                  queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
                  queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
                  queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
                  queryClient.invalidateQueries({ queryKey: [ApiQuery.StripeSubscription] })
                  navigation.pop()
                  setShowPlaid(false)
                }
              )
            }
          }}
          text="Banks & Credit Cards"
          icon={
            showPlaid || loading ? (
              <ActivityIndicator color={colors.onSurface} />
            ) : (
              <Image
                style={{
                  width: 75,
                  height: 24,
                  tintColor: dark ? 'white' : undefined
                }}
                source={require('../assets/images/plaid.png')}
                contentFit="contain"
              />
            )
          }
          disabled={loading || showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        />
        {/* <AddAccountCard
          onPress={() => {
            mxConnectUrlMutation()
          }}
          text="Banks & Credit Cards"
          icon={
            isLoadingMxConnectUrl ? (
              <ActivityIndicator color={colors.onSurface} />
            ) : (
              <Image
                style={{
                  width: 75,
                  height: 24,
                  tintColor: dark ? 'white' : undefined
                }}
                source={require('../assets/images/mx.png')}
                contentFit="contain"
              />
            )
          }
          disabled={showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        /> */}
        <AddAccountCard
          onPress={() => navigation.navigate('AddCrypto')}
          text="Crypto"
          icon={<FontAwesome5 name="bitcoin" size={24} color={colors.onSurface} />}
          disabled={showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        />
      </View>
      {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <AddAccountCard
          onPress={() => {
            finicityConnectUrlMutation()
          }}
          text="Banks & Credit Cards"
          icon={
            isLoadingFinicityConnectUrl ? (
              <ActivityIndicator color={colors.onSurface} />
            ) : (
              <Image
                style={{
                  width: 75,
                  height: 24,
                  tintColor: dark ? 'white' : undefined
                }}
                source={require('../assets/images/finicity.png')}
                contentFit="contain"
              />
            )
          }
          disabled={showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        />
      </View> */}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <AddAccountCard
          onPress={() => navigation.navigate('AddVehicle')}
          text="Vehicle"
          icon={<FontAwesome6 name="car-side" size={24} color={colors.onSurface} />}
          disabled={showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        />

        <AddAccountCard
          onPress={() => navigation.navigate('AddProperty')}
          text="Property"
          icon={<FontAwesome name="home" size={24} color={colors.onSurface} />}
          disabled={showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        />
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <AddAccountCard
          onPress={() => navigation.navigate('AddAccount')}
          text="Manual Account"
          icon={<AntDesign name="arrowup" size={24} color={colors.onSurface} />}
          disabled={showPlaid || isLoadingMxConnectUrl || isLoadingFinicityConnectUrl}
        />
      </View>
    </View>
  )
}

import { FontAwesome6 } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditMerchantRequest, editMerchant, getMerchant } from 'frontend-api'
import _ from 'lodash'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { Avatar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { MerchantForm } from '../components/forms/MerchantForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditMerchantScreen = ({ route, navigation }: RootStackScreenProps<'EditMerchant'>) => {
  const { merchantId } = route.params

  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const { data: merchant } = useQuery({
    queryKey: [ApiQuery.Merchant, merchantId],
    queryFn: async () => {
      const res = await getMerchant(merchantId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditMerchantRequest) => {
      Keyboard.dismiss()
      const res = await editMerchant(merchantId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Merchants] })
        navigation.pop()
      }
    }
  })

  if (!merchant) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <View style={{ alignSelf: 'center', marginVertical: 30 }}>
          {_.isEmpty(merchant.icon) ? (
            <Avatar.Icon
              size={100}
              icon={() => <FontAwesome6 name="building" size={50} color={colors.outline} />}
              style={{ marginEnd: 15, backgroundColor: colors.surface }}
            />
          ) : (
            <Avatar.Image size={100} source={{ uri: merchant.icon }} style={{ marginEnd: 15 }} />
          )}
        </View>
        <MerchantForm merchantInfo={merchant} onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

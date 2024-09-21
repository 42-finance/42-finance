import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditNotificationSettingRequest, editNotificationSetting } from 'frontend-api'
import { mapNotificationSettingDescription, mapNotificationSettingType } from 'frontend-utils'
import * as React from 'react'
import { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import MaskInput from 'react-native-mask-input'
import { Divider, Switch, Text, useTheme } from 'react-native-paper'
import { NotificationType } from 'shared-types'

import { View } from '../components/common/View'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'
import { dollarMask } from '../utils/mask.utils'

export const NotificationSettingScreen: React.FC<RootStackScreenProps<'NotificationSetting'>> = ({ route }) => {
  const {
    type,
    sendPushNotification: sendPushNotificationParam,
    sendEmail: sendEmailParam,
    minimumAmount: minimumAmountParam
  } = route.params
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const { currencyCode } = useUserTokenContext()

  const [sendPushNotification, setSendPushNotification] = useState(sendPushNotificationParam)
  const [sendEmail, setSendEmail] = useState(sendEmailParam)
  const [minimumAmount, setMinimumAmount] = useState(minimumAmountParam?.toString() ?? '0')

  const { mutate } = useMutation({
    mutationFn: async (request: EditNotificationSettingRequest) => {
      const res = await editNotificationSetting(type, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.NotificationSettings] })
      }
    }
  })

  const showMinimumAmount = type === NotificationType.NewExpense || type === NotificationType.NewDeposit

  const onValueChanged = (sendPushNotification: boolean, sendEmail: boolean, minimumAmount: number | null) => {
    setSendPushNotification(sendPushNotification)
    setSendEmail(sendEmail)
    mutate({
      sendPushNotification,
      sendEmail,
      minimumAmount: showMinimumAmount ? minimumAmount : null
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={{ padding: 20, backgroundColor: colors.elevation.level2 }}>
          <Text variant="titleMedium" style={{ fontSize: 17 }}>
            {mapNotificationSettingType(type)}
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 5, color: colors.outline }}>
            {mapNotificationSettingDescription(type)}
          </Text>
        </View>
        <Divider />
        {showMinimumAmount && (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                backgroundColor: colors.elevation.level2
              }}
            >
              <Text variant="bodyLarge">Minimum amount</Text>
              <MaskInput
                keyboardType="number-pad"
                value={minimumAmount}
                style={{
                  color: colors.onSurface,
                  fontSize: 16,
                  flex: 1,
                  textAlign: 'right',
                  paddingVertical: 25
                }}
                onChangeText={(_masked, unmasked) => setMinimumAmount(unmasked)}
                mask={dollarMask(currencyCode)}
                onBlur={() => onValueChanged(sendPushNotification, sendEmail, Number(minimumAmount))}
              />
            </View>
            <Divider />
          </>
        )}
        <View
          style={{ flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: colors.elevation.level2 }}
        >
          <Text variant="bodyLarge" style={{ flex: 1 }}>
            Push Notification
          </Text>
          <Switch
            value={sendPushNotification}
            onValueChange={(newValue) => onValueChanged(newValue, sendEmail, Number(minimumAmount))}
          />
        </View>
        <Divider />
        <View
          style={{ flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: colors.elevation.level2 }}
        >
          <Text variant="bodyLarge" style={{ flex: 1 }}>
            Email
          </Text>
          <Switch
            value={sendEmail}
            onValueChange={(newValue) => onValueChanged(sendPushNotification, newValue, Number(minimumAmount))}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

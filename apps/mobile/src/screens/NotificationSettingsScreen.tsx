import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, addNotificationSetting, deleteNotificationSetting, getNotificationSettings } from 'frontend-api'
import * as React from 'react'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { NotificationType } from 'shared-types'

import { View } from '../components/common/View'
import { NotificationSettingsItem } from '../components/settings/NotificationSettingsItems'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const NotificationSettingsScreen: React.FC<RootStackScreenProps<'NotificationSettings'>> = ({ navigation }) => {
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [settingValues, setSettingValues] = useState({})

  const { isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.NotificationSettings],
    queryFn: async () => {
      const res = await getNotificationSettings()
      if (res.ok && res.parsedBody?.payload) {
        const newValues = {}
        for (const notificationSetting of res.parsedBody.payload) {
          newValues[notificationSetting.type] = notificationSetting.sendPushNotification
        }
        setSettingValues(newValues)
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate } = useMutation({
    mutationFn: async (request: { type: NotificationType; value: boolean }) => {
      let res
      if (request.value) {
        res = await addNotificationSetting(request.type, {
          sendPushNotification: true,
          sendEmail: false,
          minimumAmount: 0
        })
      } else {
        res = await deleteNotificationSetting(request.type)
      }
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.NotificationSettings] })
      }
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text variant="bodySmall" style={{ color: colors.outline }}>
            ACCOUNTS
          </Text>
        </View>
        <NotificationSettingsItem
          label="Account out of sync"
          value={settingValues[NotificationType.AccountOutOfSync]}
          onValueChanged={(value) => {
            setSettingValues((v) => ({
              ...v,
              [NotificationType.AccountOutOfSync]: value
            }))
            mutate({
              type: NotificationType.AccountOutOfSync,
              value
            })
          }}
        />
        <View style={{ padding: 20 }}>
          <Text variant="bodySmall" style={{ color: colors.outline }}>
            TRANSACTIONS
          </Text>
        </View>
        <NotificationSettingsItem
          label="New transactions synced"
          value={settingValues[NotificationType.NewTransactionsSynced]}
          onValueChanged={(value) => {
            setSettingValues((v) => ({
              ...v,
              [NotificationType.NewTransactionsSynced]: value
            }))
            mutate({
              type: NotificationType.NewTransactionsSynced,
              value
            })
          }}
        />
        <Divider />
      </ScrollView>
    </View>
  )
}

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, addNotificationSetting, deleteNotificationSetting, getNotificationSettings } from 'frontend-api'
import { useState } from 'react'
import { NotificationType } from 'shared-types'

import { Alert } from '../common/alert/alert'
import { Card } from '../common/card/card'
import { NotificationSettingItem } from './notification-setting-item'

export const NotificationSettings = () => {
  const queryClient = useQueryClient()

  const [settingValues, setSettingValues] = useState<Record<NotificationType, boolean>>(
    {} as Record<NotificationType, boolean>
  )

  const { isFetching } = useQuery({
    queryKey: [ApiQuery.NotificationSettings],
    queryFn: async () => {
      const res = await getNotificationSettings()
      if (res.ok && res.parsedBody?.payload) {
        const newValues = {} as any
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

  const { mutate, isPending } = useMutation({
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
    <Card title="Notifications" className="mt-4">
      <div className="p-4">
        <Alert
          message="Control the notifications you receive by toggling the options below."
          className="mb-5 inline-block"
          showIcon
        />
        <div>
          <NotificationSettingItem
            label="Account out of sync"
            value={settingValues[NotificationType.AccountOutOfSync]}
            onValueChanged={(value: boolean) => {
              setSettingValues((v) => ({
                ...v,
                [NotificationType.AccountOutOfSync]: value
              }))
              mutate({
                type: NotificationType.AccountOutOfSync,
                value
              })
            }}
            loading={isFetching || isPending}
          />
          <NotificationSettingItem
            label="New transactions synced"
            value={settingValues[NotificationType.NewTransactionsSynced]}
            onValueChanged={(value: boolean) => {
              setSettingValues((v) => ({
                ...v,
                [NotificationType.NewTransactionsSynced]: value
              }))
              mutate({
                type: NotificationType.NewTransactionsSynced,
                value
              })
            }}
            loading={isFetching || isPending}
          />
        </div>
      </div>
    </Card>
  )
}

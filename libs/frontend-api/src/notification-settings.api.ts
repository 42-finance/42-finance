import { NotificationSetting } from 'frontend-types'
import { NotificationType } from 'shared-types'

import { config } from './config'
import { get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getNotificationSettings = async () =>
  get<HTTPResponseBody<NotificationSetting[]>>(`${config.apiUrl}/notification-settings`)

export type EditNotificationSettingRequest = {
  sendPushNotification?: boolean
  sendEmail?: boolean
  minimumAmount?: number | null
}

export const editNotificationSetting = async (type: NotificationType, body: EditNotificationSettingRequest) =>
  patch<HTTPResponseBody<NotificationSetting>>(`${config.apiUrl}/notification-settings/${type}`, body)

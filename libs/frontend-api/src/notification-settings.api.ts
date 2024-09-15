import { NotificationSetting } from 'frontend-types'
import { NotificationType } from 'shared-types'

import { config } from './config'
import { del, get, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getNotificationSettings = async () =>
  get<HTTPResponseBody<NotificationSetting[]>>(`${config.apiUrl}/notification-settings`)

export type AddNotificationSettingRequest = {
  sendPushNotification: boolean
  sendEmail: boolean
  minimumAmount: number
}

export const addNotificationSetting = async (type: NotificationType, body: AddNotificationSettingRequest) =>
  post<HTTPResponseBody<NotificationSetting>>(`${config.apiUrl}/notification-settings/${type}`, body)

type DeleteNotificationSettingResponse = {
  affected: number
}

export const deleteNotificationSetting = async (type: NotificationType) =>
  del<HTTPResponseBody<DeleteNotificationSettingResponse>>(`${config.apiUrl}/notification-settings/${type}`)

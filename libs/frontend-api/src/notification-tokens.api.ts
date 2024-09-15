import { NotificationToken } from 'frontend-types'

import { config } from './config'
import { del, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export type AddNotificationTokenRequest = {
  token: string
}

export const addNotificationToken = async (body: AddNotificationTokenRequest) =>
  post<HTTPResponseBody<NotificationToken>>(`${config.apiUrl}/notification-tokens`, body)

type DeleteNotificationTokenResponse = {
  affected: number
}

export const deleteNotificationToken = async (token: string) =>
  del<HTTPResponseBody<DeleteNotificationTokenResponse>>(`${config.apiUrl}/notification-tokens/${token}`)

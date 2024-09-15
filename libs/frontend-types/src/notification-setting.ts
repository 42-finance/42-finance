import { NotificationType } from 'shared-types'

import { User } from './user.type'

export type NotificationSetting = {
  type: NotificationType
  userId: number
  user: User
  sendPushNotification: boolean
  sendEmail: boolean
  minimumAmount: number | null
}

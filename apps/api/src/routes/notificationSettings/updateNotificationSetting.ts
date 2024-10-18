import { NotificationSetting, dataSource } from 'database'
import { Request, Response } from 'express'
import { NotificationType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateNotificationRequest = {
  sendPushNotification?: boolean
  sendEmail?: boolean
  minimumAmount?: number
}

export const updateNotificationSetting = async (
  request: Request<{ type: NotificationType }, {}, UpdateNotificationRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { type } = request.params
  const { sendPushNotification, sendEmail, minimumAmount } = request.body

  const result = await dataSource
    .getRepository(NotificationSetting)
    .createQueryBuilder()
    .insert()
    .values({
      type,
      userId,
      sendPushNotification,
      sendEmail,
      minimumAmount
    })
    .orUpdate(['sendPushNotification', 'sendEmail', 'minimumAmount'], ['type', 'userId'])
    .execute()

  return response.json({
    errors: [],
    payload: result
  })
}

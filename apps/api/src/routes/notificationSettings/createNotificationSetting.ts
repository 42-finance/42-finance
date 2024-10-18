import { NotificationSetting, dataSource } from 'database'
import { Request, Response } from 'express'
import { NotificationType } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateNotificationRequest = {
  sendPushNotification: boolean
  sendEmail: boolean
  minimumAmount: number
}

export const createNotificationSetting = async (
  request: Request<{ type: NotificationType }, {}, CreateNotificationRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { type } = request.params
  const { sendPushNotification, sendEmail, minimumAmount } = request.body

  try {
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
      .orIgnore()
      .execute()
    return response.json({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

import { NotificationSetting, dataSource } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getNotificationSettings = async (
  request: Request<{}, {}, {}, {}>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request

  try {
    const notificationSettings = await dataSource
      .createQueryBuilder()
      .select('notificationSetting')
      .from(NotificationSetting, 'notificationSetting')
      .where(`notificationSetting.userId = :userId`, { userId })
      .getMany()

    return response.json({
      errors: [],
      payload: notificationSettings
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

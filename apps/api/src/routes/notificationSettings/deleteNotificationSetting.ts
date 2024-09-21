import { NotificationSetting, dataSource } from 'database'
import { Request, Response } from 'express'
import { NotificationType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteNotificationSetting = async (
  request: Request<{ type: NotificationType }>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const type = request.params.type

  try {
    const result = await dataSource
      .getRepository(NotificationSetting)
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere('type = :type', { type })
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

import { NotificationToken, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateNotificationTokenRequest = {
  token: string
}

export const createNotificationToken = async (
  request: Request<object, object, CreateNotificationTokenRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { token } = request.body

  try {
    const existingToken = await dataSource.getRepository(NotificationToken).findOne({ where: { token } })

    if (existingToken) {
      await dataSource
        .getRepository(NotificationToken)
        .createQueryBuilder()
        .delete()
        .andWhere('token = :token', { token })
        .execute()
    }

    const notificationToken = await dataSource.getRepository(NotificationToken).save({
      userId,
      token
    })

    return response.json({
      errors: [],
      payload: notificationToken
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

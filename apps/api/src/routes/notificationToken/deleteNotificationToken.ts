import { NotificationToken, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteNotificationToken = async (
  request: Request<{ token: string }, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { token } = request.params

  const result = await dataSource
    .getRepository(NotificationToken)
    .createQueryBuilder()
    .delete()
    .where('userId = :userId', { userId })
    .andWhere('token = :token', { token })
    .execute()

  return response.json({
    errors: [],
    payload: result
  })
}

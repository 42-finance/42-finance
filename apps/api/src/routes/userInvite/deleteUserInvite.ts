import { UserInvite, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteUserInvite = async (
  request: Request<object, object, { email: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { email } = request.body

  const result = await dataSource
    .getRepository(UserInvite)
    .createQueryBuilder()
    .delete()
    .where('email = :email', { email })
    .andWhere('householdId = :householdId', { householdId })
    .execute()

  return response.json({
    errors: [],
    payload: result
  })
}

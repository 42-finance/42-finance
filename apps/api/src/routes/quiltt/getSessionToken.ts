import { Household, dataSource } from 'database'
import { Request, Response } from 'express'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getSessionToken = async (
  request: Request<object, object, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request

  const household = await dataSource.getRepository(Household).findOneOrFail({ where: { id: householdId } })

  const tokenResponse = await fetch(`https://auth.quiltt.io/v1/users/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.quiltt.secret}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: household.quilttUserId })
  })

  const data = await tokenResponse.json()

  console.log(data)

  return response.send({
    errors: [],
    payload: {
      token: data.token
    }
  })
}

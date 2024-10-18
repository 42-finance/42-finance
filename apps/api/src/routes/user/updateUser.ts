import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import { CurrencyCode } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateUserRequest = {
  name?: string
  phone?: string | null
  currencyCode?: CurrencyCode
  hideGettingStarted?: boolean
  hideWhatsNew?: boolean
  hideCommunity?: boolean
  hideOpenSource?: boolean
}

export default async (request: Request<object, object, UpdateUserRequest>, response: Response<HTTPResponseBody>) => {
  const { userId } = request
  const { name, phone, currencyCode, hideGettingStarted, hideWhatsNew, hideCommunity, hideOpenSource } = request.body

  const user = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', { userId })
    .getOneOrFail()

  const result = await dataSource.getRepository(User).update(user.id, {
    name,
    phone,
    currencyCode,
    hideGettingStarted,
    hideWhatsNew,
    profileUpdated: true,
    hideCommunity,
    hideOpenSource
  })

  return response.json({
    errors: [],
    payload: result
  })
}

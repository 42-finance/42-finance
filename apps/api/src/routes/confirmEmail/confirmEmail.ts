import { Boom } from '@hapi/boom'
import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { createHousehold } from '../../utils/household.utils'
import { createDefaultNotifications } from '../../utils/notification.utils'
import { verifyJwt } from '../../utils/token.utils'

type ConfirmEmailRequest = {
  userId: number
  token: string
}

export const confirmEmail = async (
  request: Request<object, object, ConfirmEmailRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId, token } = request.body

  const user = await dataSource.getRepository(User).findOne({ where: { id: userId } })

  if (!user || !user.passwordHash) {
    throw new Boom('Invalid user', { statusCode: 401 })
  }

  if (user.emailConfirmed) {
    throw new Boom('Email has already been confirmed', { statusCode: 409 })
  }

  verifyJwt(token, user.passwordHash)

  return await dataSource.transaction(async (entityManager) => {
    await entityManager.getRepository(User).update(user.id, { emailConfirmed: true })

    await createDefaultNotifications(user.id, entityManager)

    const household = await createHousehold(user, entityManager)

    const token = jwt.sign({ householdId: household.id, userId: user.id }, process.env.TOKEN_SECRET as string)

    return response.json({
      errors: [],
      payload: {
        token,
        user: _.omit(user, ['passwordHash']),
        currencyCode: user.currencyCode
      }
    })
  })
}

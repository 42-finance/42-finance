import { Boom } from '@hapi/boom'
import bcrypt from 'bcryptjs'
import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { verifyJwt } from '../../utils/token.utils'
import validateFields from '../helpers/validateFields'

type ResetPasswordRequest = {
  userId: number
  token: string
  newPassword: string
}

export const resetPassword = async (
  request: Request<object, object, ResetPasswordRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId, token, newPassword } = request.body

  const validationErrors = validateFields(
    {
      required: ['token', 'newPassword']
    },
    request.body
  )
  if (!_.isEmpty(validationErrors)) {
    return response.status(400).json({
      errors: validationErrors,
      payload: {}
    })
  }

  const user = await dataSource.getRepository(User).findOne({ where: { id: userId } })

  if (!user || !user.passwordHash) {
    throw new Boom('Invalid user', { statusCode: 401 })
  }

  verifyJwt(token, user.passwordHash)

  const passwordHash = await bcrypt.hash(newPassword, 10)

  dataSource.getRepository(User).update(user.id, { passwordHash })

  response.json({
    errors: [],
    payload: { message: 'Your password has been reset. You can now login with your new password.' }
  })
}

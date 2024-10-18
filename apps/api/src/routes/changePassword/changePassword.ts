import { Boom } from '@hapi/boom'
import bcrypt from 'bcryptjs'
import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import validateFields from '../helpers/validateFields'

type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export const changePassword = async (
  request: Request<object, object, ChangePasswordRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { currentPassword, newPassword } = request.body

  const validationErrors = validateFields(
    {
      required: ['currentPassword', 'newPassword']
    },
    request.body
  )
  if (!_.isEmpty(validationErrors)) {
    return response.status(400).json({
      errors: validationErrors,
      payload: {}
    })
  }

  const user = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', { userId })
    .getOneOrFail()

  if (!user.passwordHash) {
    throw new Boom('You have not setup a password. Set an initial password first', { statusCode: 409 })
  }

  const passwordCorrect = await bcrypt.compare(currentPassword, user.passwordHash)

  if (!passwordCorrect) {
    throw new Boom('Password is incorrect', { statusCode: 403 })
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  dataSource.getRepository(User).update(userId, { passwordHash })

  response.json({
    errors: [],
    payload: { message: 'Your password has been changed.' }
  })
}

import { Boom } from '@hapi/boom'
import bcrypt from 'bcryptjs'
import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import validateFields from '../helpers/validateFields'

type SetPasswordRequest = {
  password: string
}

export const setPassword = async (
  request: Request<object, object, SetPasswordRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { password } = request.body

  const validationErrors = validateFields(
    {
      required: ['password']
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

  if (user.passwordHash) {
    throw new Boom('You have already setup a password.', { statusCode: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  dataSource.getRepository(User).update(userId, { passwordHash })

  response.json({
    errors: [],
    payload: { message: 'Your password has been setup.' }
  })
}

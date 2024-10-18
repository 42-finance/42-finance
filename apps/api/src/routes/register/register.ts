import bcrypt from 'bcryptjs'
import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import _, { assign } from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { sendEmailConfirmation } from '../../services/emailConfirmation/emailConfirmationService'
import validateFields from '../helpers/validateFields'

export const register = async (
  request: Request<object, object, { name: string; email: string; password: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { name, email, password } = request.body

  const validationErrors = validateFields(
    {
      required: ['email', 'name', 'password']
    },
    request.body
  )
  if (!_.isEmpty(validationErrors)) {
    return response.status(400).json({
      errors: validationErrors,
      payload: {}
    })
  }

  return await dataSource.transaction(async (entityManager) => {
    const existingUser = await entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne()

    if (existingUser?.emailConfirmed) {
      return response.status(409).json({
        errors: [`A user already exists with the email ${email}`],
        payload: {}
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await entityManager
      .getRepository(User)
      .save(existingUser ? assign(existingUser, { name, passwordHash }) : { email, name, passwordHash })

    await sendEmailConfirmation(user.id, user.email, user.passwordHash)

    return response.json({
      errors: [],
      payload: user
    })
  })
}

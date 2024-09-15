import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { EmailType } from 'shared-types'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getUserByEmail } from '../../models/user/getUserByEmail'
import { sendEmail } from '../../services/email/emailService'

type ForgotPasswordRequest = {
  email: string
}

export const forgotPassword = async (
  request: Request<object, object, ForgotPasswordRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { email } = request.body

  const user = await getUserByEmail(email)

  if (!user || !user.passwordHash) {
    return response.json({ errors: [], payload: {} })
  }

  const token = jwt.sign({ userId: user.id }, user.passwordHash, { expiresIn: '1h' })

  const link = `${config.frontend.appUrl}/reset-password?${new URLSearchParams({
    userId: user.id.toString(),
    token
  }).toString()}`

  await sendEmail(user.email, '42 Finance - Reset Password', EmailType.ForgotPassword, {
    link
  })

  return response.json({ errors: [], payload: {} })
}

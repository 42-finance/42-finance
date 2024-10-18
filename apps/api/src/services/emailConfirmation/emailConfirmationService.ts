import jwt from 'jsonwebtoken'
import { EmailType } from 'shared-types'

import { config } from '../../common/config'
import { sendEmail } from '../email/emailService'

export async function sendEmailConfirmation(userId: number, email: string, passwordHash: string) {
  const token = jwt.sign({ userId }, passwordHash, { expiresIn: '1h' })

  const link = `${config.frontend.appUrl}/confirm-email?${new URLSearchParams({
    userId: userId.toString(),
    token
  }).toString()}`

  await sendEmail(email, '42 Finance - Confirm Email', EmailType.EmailConfirmation, {
    link
  })
}

import { User, UserInvite, dataSource } from 'database'
import jwt from 'jsonwebtoken'
import { EmailType, UserPermission } from 'shared-types'

import { config } from '../../common/config'
import { sendEmail } from '../email/emailService'

export const sendUserInvite = async (
  email: string,
  householdId: number,
  invitedByUser: User,
  permission: UserPermission
) => {
  await dataSource.getRepository(UserInvite).save({
    email,
    householdId,
    permission,
    invitedByUserId: invitedByUser.id
  })

  const token = jwt.sign(
    {
      householdId,
      permission,
      email
    },
    config.auth.tokenSecret
  )

  const link = `${config.frontend.appUrl}/invitation?${new URLSearchParams({
    token
  }).toString()}`

  await sendEmail(email, '42 Finance - Invitation', EmailType.Invitation, {
    name: invitedByUser.name,
    link
  })
}

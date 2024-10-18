import { UserPermission } from 'shared-types'

import { User } from './user.type'

export type UserInvite = {
  email: string
  householdId: number
  permission: UserPermission
  invitedByUserId: number
  invitedByUser: User
}

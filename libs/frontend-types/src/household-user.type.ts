import { UserPermission } from 'shared-types'

import { User } from './user.type'

export type HouseholdUser = {
  userId: number
  user: User
  householdId: number
  permission: UserPermission
  email: string
  canDelete: boolean
}

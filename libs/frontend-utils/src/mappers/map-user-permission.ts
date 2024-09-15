import { UserPermission } from 'shared-types'

export const mapUserPermission = (userPermission: UserPermission) => {
  switch (userPermission) {
    case UserPermission.Owner:
      return 'Owner'
    case UserPermission.Admin:
      return 'Admin'
    case UserPermission.User:
      return 'User'
  }
}

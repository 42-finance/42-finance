import { AccountType } from 'shared-types'

export const mapAccountType = (accountType: AccountType) => {
  switch (accountType) {
    case AccountType.Asset:
      return 'Asset'
    case AccountType.Liability:
      return 'Liability'
  }
}

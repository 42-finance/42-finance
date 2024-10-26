import { AccountGroupType } from 'shared-types'

import { Account } from './account.type'

export type AccountGroup = {
  id: number
  name: string
  type: AccountGroupType
  accounts: Account[]
}

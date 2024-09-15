import { ConnectionType } from 'shared-types'

import { Account } from './account.type'

export type Connection = {
  id: string
  institutionId: string
  institutionName: string
  institutionLogo: string | null
  accessToken: string
  needsTokenRefresh: boolean
  accounts: Account[]
  type: ConnectionType
}

import { AccountSubType, AccountType, CurrencyCode, WalletType } from 'shared-types'

import { Connection } from './connection.type'

export type Account = {
  id: string
  name: string
  officialName: string | null
  mask: string | null
  type: AccountType
  subType: AccountSubType
  currentBalance: number
  availableBalance: number | null
  limit: number | null
  currencyCode: CurrencyCode
  walletType: WalletType | null
  walletAddress: string | null
  walletTokenBalance: number | null
  connectionId: string | null
  connection: Connection | null
  updatedAt: Date
  transactionCount?: number
  convertedBalance: number
}

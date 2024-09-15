import { Account } from './account.type'

export type BalanceHistory = {
  date: Date
  availableBalance: number | null
  currentBalance: number
  convertedBalance: number
  accountId: string
  account: Account
}

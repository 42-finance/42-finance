import { Account } from './account.type'

export type BillPayment = {
  id: number
  amount: number
  date: Date
  accountId: string
  account: Account
  convertedAmount: number
}

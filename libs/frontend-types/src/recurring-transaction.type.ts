import { CategoryType, Frequency } from 'shared-types'

import { Account } from './account.type'
import { Merchant } from './merchant.type'
import { Transaction } from './transaction.type'

export type RecurringTransaction = {
  id: number
  name: string
  startDate: Date
  frequency: Frequency
  interval: number | null
  amount: number
  convertedAmount: number
  type: CategoryType
  status: boolean
  accountId: string
  account: Account
  merchantId: number
  merchant: Merchant
  transactions: Transaction[]
}

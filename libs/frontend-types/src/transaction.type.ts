import { CurrencyCode, TransactionType } from 'shared-types'

import { Account } from './account.type'
import { Category } from './category.type'
import { Merchant } from './merchant.type'
import { RecurringTransaction } from './recurring-transaction.type'
import { Rule } from './rule.type'
import { Tag } from './tag.type'

export type Transaction = {
  id: string
  name: string
  date: Date
  authorizedDate: Date | null
  amount: number
  convertedAmount: number
  currencyCode: CurrencyCode
  pending: boolean
  type: TransactionType
  needsReview: boolean
  hidden: boolean
  accountId: string
  account: Account
  categoryId: number
  category: Category
  merchantId: number
  merchant: Merchant
  splitTransactionId: string
  splitTransaction: Transaction
  split: boolean
  historyCount?: number
  matchingRules?: Rule[]
  splitTransactions?: Transaction[]
  notes: string
  attachments: string[]
  tags: Tag[]
  recurringTransaction: RecurringTransaction | null
}

import { CurrencyCode } from 'shared-types'

import { FinicityCategory } from './FinicityCategory'

export type FinicityTransaction = {
  id: number
  amount: number
  accountId: number
  customerId: number
  status: string
  description: string
  postedDate: number
  transactionDate: number
  createdDate: number
  categorization: {
    normalizedPayeeName: string
    category: FinicityCategory
    bestRepresentation: string
    country: string
  }
  currencySymbol: CurrencyCode | null
}

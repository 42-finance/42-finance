import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'

import { Account } from './account.type'
import { Category } from './category.type'

export type Rule = {
  id: number
  merchantValueFilter: NameFilter | null
  merchantName: string | null
  merchantOriginalStatement: string | null
  amountType: TransactionAmountType | null
  amountFilterType: AmountFilter | null
  amountValue: number | null
  amountValue2: number | null
  categoryId: number | null
  category: Category | null
  accountId: string | null
  account: Account | null
  newMerchantName: string | null
  newCategoryId: number | null
  newCategory: Category
  hideTransaction: boolean | null
  needsReview: boolean | null
}

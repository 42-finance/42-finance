import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'

export type TransactionQueryParams = {
  startDate?: string | null
  endDate?: string | null
  limit?: number | null
  search?: string | null
  categoryIds?: string | null
  merchantIds?: string | null
  merchantValueFilter?: NameFilter | null
  merchantName?: string | null
  merchantOriginalStatement?: string | null
  groupIds?: string | null
  accountIds?: string | null
  tagIds?: string | null
  hidden?: boolean | null
  needsReview?: boolean | null
  amountType?: TransactionAmountType | null
  amountFilter?: AmountFilter | null
  amountValue?: number | null
  amountValue2?: number | null
  hideFromBudget?: boolean
}

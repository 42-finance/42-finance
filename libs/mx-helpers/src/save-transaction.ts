import { Rule, Transaction, applyRules, dataSource } from 'database'
import { TransactionResponse } from 'mx-platform-node'
import { CurrencyCode, TransactionType } from 'shared-types'

import { getCategory } from './utils/get-category'
import { getMerchant } from './utils/get-merchant'

export const saveTransaction = async (
  transaction: TransactionResponse,
  householdId: number,
  rules: Rule[],
  currencyCode: CurrencyCode
) => {
  const category = await getCategory(transaction, householdId)
  const merchant = await getMerchant(transaction, householdId)

  let amount = transaction.amount as number
  if (transaction.type === 'CREDIT') {
    amount = -amount
  }

  const { merchantIdOverride, categoryIdOverride, hideOverride, needsReviewOverride } = await applyRules(
    rules,
    householdId,
    transaction.description as string,
    amount,
    transaction.account_guid as string,
    category,
    merchant
  )

  return await dataSource.getRepository(Transaction).save({
    id: transaction.guid as string,
    name: transaction.original_description as string,
    date: new Date((transaction.transacted_at ?? transaction.date) as string),
    amount,
    currencyCode: (transaction.currency_code as CurrencyCode) ?? currencyCode,
    pending: false,
    type: TransactionType.MX,
    needsReview: needsReviewOverride ?? true,
    hidden: hideOverride ?? false,
    accountId: transaction.account_guid as string,
    categoryId: categoryIdOverride ?? category.id,
    merchantId: merchantIdOverride ?? merchant.id,
    householdId
  })
}

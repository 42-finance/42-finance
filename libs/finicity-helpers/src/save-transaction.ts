import { Rule, Transaction, applyRules, dataSource } from 'database'
import { CurrencyCode, TransactionType } from 'shared-types'

import { FinicityTransaction } from './types/FinicityTransaction'
import { getCategory } from './utils/get-category'
import { getMerchant } from './utils/get-merchant'

export const saveTransaction = async (
  transaction: FinicityTransaction,
  householdId: number,
  rules: Rule[],
  currencyCode: CurrencyCode
) => {
  const category = await getCategory(transaction, householdId)
  const merchant = await getMerchant(transaction, householdId)
  const amount = -transaction.amount

  const { merchantIdOverride, categoryIdOverride, hideOverride, needsReviewOverride } = await applyRules(
    rules,
    householdId,
    transaction.description,
    amount,
    transaction.accountId.toString(),
    category,
    merchant
  )

  return await dataSource.getRepository(Transaction).save({
    id: transaction.id.toString(),
    name: transaction.description,
    date: new Date(transaction.transactionDate * 1000),
    amount,
    currencyCode: transaction.currencySymbol ?? currencyCode,
    pending: false,
    type: TransactionType.Finicity,
    needsReview: needsReviewOverride ?? true,
    hidden: hideOverride ?? false,
    accountId: transaction.accountId.toString(),
    categoryId: categoryIdOverride ?? category.id,
    merchantId: merchantIdOverride ?? merchant.id,
    householdId
  })
}

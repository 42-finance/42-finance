import { Account, Rule, Transaction, applyRules, createOrUpdateRecurringTransaction, dataSource } from 'database'
import { Transaction as PlaidTransaction } from 'plaid'
import { CurrencyCode, TransactionType } from 'shared-types'

import { getCategory } from './utils/getCategory'
import { getMerchant } from './utils/getMerchant'

export const saveTransaction = async (transaction: PlaidTransaction, householdId: number, rules: Rule[]) => {
  const account = await dataSource.getRepository(Account).findOne({ where: { id: transaction.account_id } })
  if (!account) {
    return null
  }

  const category = await getCategory(transaction, householdId)
  const merchant = await getMerchant(transaction, householdId)

  const { merchantIdOverride, categoryIdOverride, hideOverride, needsReviewOverride } = await applyRules(
    rules,
    householdId,
    transaction.name,
    transaction.amount,
    transaction.account_id,
    category,
    merchant
  )

  let pendingTransaction: Transaction | null = null

  if (transaction.pending_transaction_id) {
    pendingTransaction = await dataSource
      .getRepository(Transaction)
      .findOneBy({ id: transaction.pending_transaction_id })
  }

  const savedTransaction = await dataSource.getRepository(Transaction).save({
    id: transaction.transaction_id,
    name: transaction.name,
    date: transaction.authorized_datetime ?? transaction.authorized_date ?? transaction.datetime ?? transaction.date,
    amount: transaction.amount,
    currencyCode:
      pendingTransaction?.currencyCode ??
      (transaction.iso_currency_code as CurrencyCode) ??
      (transaction.unofficial_currency_code as CurrencyCode) ??
      CurrencyCode.USD,
    pending: transaction.pending,
    type: TransactionType.Plaid,
    needsReview: pendingTransaction?.needsReview ?? needsReviewOverride ?? true,
    hidden: pendingTransaction?.hidden ?? hideOverride ?? false,
    accountId: transaction.account_id,
    categoryId: pendingTransaction?.categoryId ?? categoryIdOverride ?? category.id,
    merchantId: merchantIdOverride ?? merchant.id,
    householdId
  })

  await createOrUpdateRecurringTransaction(savedTransaction, householdId)

  return savedTransaction
}

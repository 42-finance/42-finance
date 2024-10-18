import { Category, Merchant, Rule, Transaction, getOrCreateMerchant } from 'database'
import { EntityManager } from 'typeorm'

import { fetchTransactions } from '../models/transaction/fetchTransactions'

export const applyRuleToExisting = async (householdId: number, rule: Rule, entityManager: EntityManager) => {
  const transactions = await fetchTransactions(householdId, {
    merchantValueFilter: rule.merchantValueFilter,
    merchantName: rule.merchantName,
    merchantOriginalStatement: rule.merchantOriginalStatement,
    amountType: rule.amountType,
    amountFilter: rule.amountFilterType,
    amountValue: rule.amountValue,
    amountValue2: rule.amountValue2,
    categoryIds: rule.categoryId?.toString() ?? null,
    accountIds: rule.accountId
  })

  if (transactions.length) {
    const newMerchant: Merchant | null = rule.newMerchantName
      ? await getOrCreateMerchant(rule.newMerchantName, rule.newMerchantName, null, householdId)
      : null

    const newCategory: Category | null = rule.newCategoryId
      ? await entityManager.getRepository(Category).findOneOrFail({ where: { id: rule.newCategoryId, householdId } })
      : null

    entityManager.getRepository(Transaction).update(
      transactions.map((t) => t.id),
      {
        merchantId: newMerchant?.id ?? undefined,
        categoryId: newCategory?.id ?? undefined,
        hidden: rule.hideTransaction ?? undefined,
        needsReview: rule.needsReview ?? undefined
      }
    )
  }
}

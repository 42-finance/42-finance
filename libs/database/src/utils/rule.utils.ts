import { isNil } from 'lodash'
import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'

import { Category } from '../models/category'
import { Merchant } from '../models/merchant'
import { Rule } from '../models/rule'
import { getOrCreateMerchant } from './merchant.utils'

export const applyRules = async (
  rules: Rule[],
  householdId: number,
  transactionName: string,
  transactionAmount: number,
  transactionAccountId: string,
  category: Category,
  merchant: Merchant
) => {
  let merchantIdOverride: number | null = null
  let categoryIdOverride: number | null = null
  let hideOverride: boolean | null = null
  let needsReviewOverride: boolean | null = null

  for (const rule of rules) {
    const applyRule = shouldApplyRule(
      rule,
      transactionName,
      transactionAmount,
      transactionAccountId,
      category,
      merchant
    )

    if (applyRule) {
      if (rule.newMerchantName) {
        const newMerchant = await getOrCreateMerchant(rule.newMerchantName, rule.newMerchantName, null, householdId)
        merchantIdOverride = newMerchant.id
      }

      if (rule.newCategoryId) {
        categoryIdOverride = rule.newCategoryId
      }
      if (!isNil(rule.hideTransaction)) {
        hideOverride = rule.hideTransaction
      }
      if (!isNil(rule.needsReview)) {
        needsReviewOverride = rule.needsReview
      }
    }
  }

  return {
    merchantIdOverride,
    categoryIdOverride,
    hideOverride,
    needsReviewOverride
  }
}

export const shouldApplyRule = (
  rule: Rule,
  transactionName: string,
  transactionAmount: number,
  transactionAccountId: string,
  category: Category,
  merchant: Merchant
) => {
  let applyMerchantRule: boolean | null = null

  if (rule.merchantValueFilter && (rule.merchantName || rule.merchantOriginalStatement)) {
    if (rule.merchantValueFilter === NameFilter.Matches) {
      applyMerchantRule = rule.merchantName === merchant.name || rule.merchantOriginalStatement === transactionName
    } else if (rule.merchantValueFilter === NameFilter.Contains) {
      applyMerchantRule =
        (rule.merchantName != null && merchant.name.includes(rule.merchantName)) ||
        (rule.merchantOriginalStatement != null && transactionName.includes(rule.merchantOriginalStatement))
    }
  }

  if (applyMerchantRule === false) return false

  let applyAmountRule: boolean | null = null

  if (
    rule.amountType &&
    rule.amountFilterType &&
    rule.amountValue != null &&
    (rule.amountFilterType !== AmountFilter.Between || rule.amountValue2 != null)
  ) {
    applyAmountRule =
      (rule.amountType === TransactionAmountType.Credit && transactionAmount < 0) ||
      (rule.amountType === TransactionAmountType.Debit && transactionAmount > 0)

    if (applyAmountRule) {
      const amount = Math.abs(transactionAmount)

      switch (rule.amountFilterType) {
        case AmountFilter.LessThan:
          applyAmountRule = rule.amountValue != null && amount < rule.amountValue
          break
        case AmountFilter.Equal:
          applyAmountRule = rule.amountValue != null && amount === rule.amountValue
          break
        case AmountFilter.GreaterThan:
          applyAmountRule = rule.amountValue != null && amount > rule.amountValue
          break
        case AmountFilter.Between:
          applyAmountRule =
            rule.amountValue != null &&
            rule.amountValue2 != null &&
            amount > rule.amountValue &&
            amount < rule.amountValue2
          break
      }
    }
  }

  if (applyAmountRule === false) return false

  let applyCategoryRule: boolean | null = null

  if (rule.categoryId) {
    applyCategoryRule = rule.categoryId === category.id
  }

  if (applyCategoryRule === false) return false

  let applyAccountRule: boolean | null = null

  if (rule.accountId) {
    applyAccountRule = rule.accountId === transactionAccountId
  }

  if (applyAccountRule === false) return false

  return (applyMerchantRule || applyAmountRule || applyCategoryRule || applyAccountRule) ?? false
}

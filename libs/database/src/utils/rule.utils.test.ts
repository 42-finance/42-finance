import { Category, Merchant, Rule } from 'database'
import { Transaction as PlaidTransaction } from 'plaid'
import { CategoryType, NameFilter } from 'shared-types'

import { shouldApplyRule } from './rule.utils'

describe('ShouldApplyRule', () => {
  const rule = {
    merchantValueFilter: null,
    merchantName: null,
    merchantOriginalStatement: null,
    amountType: null,
    amountFilterType: null,
    amountValue: null,
    amountValue2: null,
    categoryId: null,
    accountId: null
  } as Rule

  const transaction = {
    account_id: 'account_id',
    amount: 500,
    name: 'transaction'
  } as PlaidTransaction

  const category = {
    id: 1,
    group: {
      id: 1,
      type: CategoryType.Expense
    }
  } as Category

  const merchant = {
    name: 'merchant'
  } as Merchant

  it('should return false when all values are null', async () => {
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(false)
  })

  it('should return false when merchant name does not match', async () => {
    rule.merchantValueFilter = NameFilter.Matches
    rule.merchantName = 'merchant_2'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(false)
  })

  it('should return false when merchant original statement does not match', async () => {
    rule.merchantValueFilter = NameFilter.Matches
    rule.merchantOriginalStatement = 'transaction_2'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(false)
  })

  it('should return false when merchant name does not contain', async () => {
    rule.merchantValueFilter = NameFilter.Contains
    rule.merchantName = 'merchant_2'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(false)
  })

  it('should return false when merchant original statement does not contain', async () => {
    rule.merchantValueFilter = NameFilter.Contains
    rule.merchantOriginalStatement = 'transaction_2'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(false)
  })

  it('should return true when merchant name does match', async () => {
    rule.merchantValueFilter = NameFilter.Matches
    rule.merchantName = 'merchant'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(true)
  })

  it('should return true when merchant original statement does match', async () => {
    rule.merchantValueFilter = NameFilter.Matches
    rule.merchantOriginalStatement = 'transaction'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(true)
  })

  it('should return true when merchant name does contain', async () => {
    rule.merchantValueFilter = NameFilter.Contains
    rule.merchantName = 'chant'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(true)
  })

  it('should return true when merchant original statement does contain', async () => {
    rule.merchantValueFilter = NameFilter.Contains
    rule.merchantOriginalStatement = 'trans'
    const result = shouldApplyRule(rule, transaction, category, merchant)
    expect(result).toBe(true)
  })
})

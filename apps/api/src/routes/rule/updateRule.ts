import { Rule, dataSource } from 'database'
import { Request, Response } from 'express'
import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { applyRuleToExisting } from '../../utils/rules.utils'

type UpdateRuleRequest = {
  merchantValueFilter: NameFilter | null
  merchantName: string | null
  merchantOriginalStatement: string | null
  amountType: TransactionAmountType | null
  amountFilterType: AmountFilter | null
  amountValue: number | null
  amountValue2: number | null
  categoryId: number | null
  accountId: string | null
  newMerchantName: string | null
  newCategoryId: number | null
  hideTransaction: boolean | null
  needsReview: boolean | null
  priority: number
  applyToExisting: boolean
}

export const updateRule = async (
  request: Request<{ id: string }, object, UpdateRuleRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const {
    merchantValueFilter,
    merchantName,
    merchantOriginalStatement,
    amountType,
    amountFilterType,
    amountValue,
    amountValue2,
    categoryId,
    accountId,
    newMerchantName,
    newCategoryId,
    hideTransaction,
    needsReview,
    priority,
    applyToExisting
  } = request.body

  const rule = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .where('rule.id = :id', { id })
    .andWhere('rule.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    const result = await entityManager.getRepository(Rule).update(rule.id, {
      merchantValueFilter,
      merchantName,
      merchantOriginalStatement,
      amountType,
      amountFilterType,
      amountValue,
      amountValue2,
      categoryId,
      accountId,
      newMerchantName,
      newCategoryId,
      hideTransaction,
      needsReview,
      priority
    })

    if (applyToExisting) {
      await applyRuleToExisting(householdId, rule, entityManager)
    }

    return response.json({
      errors: [],
      payload: result
    })
  })
}

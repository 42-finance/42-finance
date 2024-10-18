import { Rule } from 'frontend-types'
import _ from 'lodash'
import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getRule = async (ruleId: number) => get<HTTPResponseBody<Rule>>(`${config.apiUrl}/rules/${ruleId}`)

type RulesQuery = {
  search?: string | null
}

export const getRules = async (query: RulesQuery) => {
  const url = new URL(`${config.apiUrl}/rules`)
  const searchParams = new URLSearchParams()
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<Rule[]>>(url.toString())
}

export type AddRuleRequest = {
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
  applyToExisting: boolean
}

export const addRule = async (body: AddRuleRequest) => post<HTTPResponseBody<Rule>>(`${config.apiUrl}/rules`, body)

export type EditRuleRequest = {
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
  applyToExisting: boolean
}

export const editRule = async (ruleId: number, body: EditRuleRequest) =>
  patch<HTTPResponseBody<Rule>>(`${config.apiUrl}/rules/${ruleId}`, body)

type DeleteRuleResponse = {
  affected: number
}

export const deleteRule = async (ruleId: number) =>
  del<HTTPResponseBody<DeleteRuleResponse>>(`${config.apiUrl}/rules/${ruleId}`)

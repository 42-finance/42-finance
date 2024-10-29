import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfDay, startOfDay } from 'date-fns'
import { Account, Category, Merchant, Transaction } from 'frontend-types'
import { dateToUtc } from 'frontend-utils'
import _ from 'lodash'
import { AmountFilter, CurrencyCode, NameFilter, TransactionAmountType } from 'shared-types'

import { ApiQuery } from './api-query'
import { config } from './config'
import { del, get, patch, post, postMultiPart } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getTransaction = async (transactionId: string) =>
  get<HTTPResponseBody<Transaction>>(`${config.apiUrl}/transactions/${transactionId}`)

type TransactionQuery = {
  startDate?: Date | null
  endDate?: Date | null
  limit?: number | null
  search?: string | null
  categoryIds?: number[] | null
  merchantIds?: number[] | null
  merchantValueFilter?: NameFilter | null
  merchantName?: string | null
  merchantOriginalStatement?: string | null
  groupIds?: number[] | null
  accountIds?: string[] | null
  tagIds?: number[] | null
  hidden?: boolean | null
  needsReview?: boolean | null
  amountType?: TransactionAmountType | null
  amountFilter?: AmountFilter | null
  amountValue?: number | null
  amountValue2?: number | null
  hideFromBudget?: boolean
}

const buildGetTransactionsUrl = (baseUrl: string, query: TransactionQuery) => {
  const url = new URL(baseUrl)
  const searchParams = new URLSearchParams()
  if (query.startDate) {
    searchParams.append('startDate', query.startDate.toISOString())
  }
  if (query.endDate) {
    searchParams.append('endDate', query.endDate.toISOString())
  }
  if (query.limit) {
    searchParams.append('limit', query.limit.toString())
  }
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  if (query.categoryIds) {
    searchParams.append('categoryIds', query.categoryIds.join(','))
  }
  if (query.merchantIds) {
    searchParams.append('merchantIds', query.merchantIds.join(','))
  }
  if (query.merchantValueFilter) {
    searchParams.append('merchantValueFilter', query.merchantValueFilter)
  }
  if (query.merchantName) {
    searchParams.append('merchantName', query.merchantName)
  }
  if (query.merchantOriginalStatement) {
    searchParams.append('merchantOriginalStatement', query.merchantOriginalStatement)
  }
  if (query.groupIds) {
    searchParams.append('groupIds', query.groupIds.join(','))
  }
  if (query.accountIds) {
    searchParams.append('accountIds', query.accountIds.join(','))
  }
  if (query.tagIds) {
    searchParams.append('tagIds', query.tagIds.join(','))
  }
  if (query.hidden != null) {
    searchParams.append('hidden', query.hidden.toString())
  }
  if (query.needsReview != null) {
    searchParams.append('needsReview', query.needsReview.toString())
  }
  if (query.amountType) {
    searchParams.append('amountType', query.amountType)
  }
  if (query.amountFilter) {
    searchParams.append('amountFilter', query.amountFilter)
  }
  if (query.amountValue) {
    searchParams.append('amountValue', query.amountValue.toString())
  }
  if (query.amountValue2) {
    searchParams.append('amountValue2', query.amountValue2.toString())
  }
  url.search = searchParams.toString()
  return url.toString()
}

export const getTransactions = async (query: TransactionQuery = {}) => {
  const url = buildGetTransactionsUrl(`${config.apiUrl}/transactions`, query)
  return get<HTTPResponseBody<Transaction[]>>(url)
}

export type TransactionsStats = {
  totalAmount: number
  averageTransaction: number
  totalTransactions: number
}

export const getTransactionsStats = async (query: TransactionQuery = {}) => {
  const url = buildGetTransactionsUrl(`${config.apiUrl}/transactions/stats`, query)
  return get<HTTPResponseBody<TransactionsStats>>(url)
}

export const useTransactions = (
  amountType: TransactionAmountType | null,
  amountFilter: AmountFilter | null,
  amountValue: number | null,
  amountValue2: number | null,
  accounts: Account[],
  startDate: Date | null,
  endDate: Date | null,
  categories: Category[],
  merchants: Merchant[],
  hidden: boolean | null,
  needsReview: boolean | null,
  limit: number | null,
  search: string | null
) => {
  return useQuery({
    queryKey: [
      ApiQuery.Transactions,
      limit,
      search,
      startDate,
      endDate,
      accounts,
      categories,
      merchants,
      hidden,
      needsReview,
      amountType,
      amountFilter,
      amountValue,
      amountValue2
    ],
    queryFn: async () => {
      const accountIds = accounts.length > 0 ? accounts.map((c) => c.id) : null
      const categoryIds = categories.length > 0 ? categories.map((c) => c.id) : null
      const merchantIds = merchants.length > 0 ? merchants.map((c) => c.id) : null
      const res = await getTransactions({
        startDate: startDate ? dateToUtc(startOfDay(startDate)) : undefined,
        endDate: endDate ? dateToUtc(endOfDay(endDate)) : undefined,
        limit,
        search,
        accountIds,
        categoryIds,
        merchantIds,
        hidden,
        needsReview,
        amountType,
        amountFilter,
        amountValue,
        amountValue2
      })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })
}

export const exportTransactions = async (query: TransactionQuery = {}) => {
  const url = buildGetTransactionsUrl(`${config.apiUrl}/transactions/export`, query)
  return get<HTTPResponseBody<string>>(url)
}

export type AddTransactionRequest = {
  date: Date
  amount: number
  accountId: string
  categoryId: number
  merchantName: string
}

export const addTransaction = async (body: AddTransactionRequest) =>
  post<HTTPResponseBody<Transaction>>(`${config.apiUrl}/transactions`, body)

export type EditTransactionRequest = {
  date?: Date
  categoryId?: number
  hidden?: boolean
  needsReview?: boolean
  currencyCode?: CurrencyCode
  notes?: string
  tagIds?: number[]
  recurringTransactionId?: number | null
}

export const editTransaction = async (transactionId: string, body: EditTransactionRequest) =>
  patch<HTTPResponseBody<Transaction>>(`${config.apiUrl}/transactions/${transactionId}`, body)

export type EditTransactionsRequest = {
  transactionIds: string[]
  date?: Date
  hidden?: boolean
  needsReview?: boolean
  categoryId?: number
  merchantId?: number
  tagIds?: number[]
  recurringTransactionId?: number
}

export const editTransactions = async (body: EditTransactionsRequest) =>
  patch<HTTPResponseBody<Transaction[]>>(`${config.apiUrl}/transactions`, body)

export type SplitTransaction = {
  id: string
  amount: number
  categoryId: number
}

export type SplitTransactionRequest = {
  splitTransactions: SplitTransaction[]
}

export const splitTransaction = async (transactionId: string, body: SplitTransactionRequest) =>
  patch<HTTPResponseBody<Transaction>>(`${config.apiUrl}/transactions/${transactionId}/split`, body)

type DeleteTransactionResponse = {
  affected: number
}

export const deleteTransaction = async (transactionId: string) =>
  del<HTTPResponseBody<DeleteTransactionResponse>>(`${config.apiUrl}/transactions/${transactionId}`)

export const deleteTransactions = async (transactionIds: string[]) =>
  del<HTTPResponseBody<DeleteTransactionResponse>>(`${config.apiUrl}/transactions`, transactionIds)

export const deleteSplitTransactions = async (transactionId: string) =>
  del<HTTPResponseBody<DeleteTransactionResponse>>(`${config.apiUrl}/transactions/${transactionId}/split`)

export const uploadAttachment = async (transactionId: string, body: FormData) =>
  postMultiPart<HTTPResponseBody<any>>(`${config.apiUrl}/transactions/${transactionId}/attachment`, body)

export const deleteAttachment = async (transactionId: string, attachment: string) =>
  del<HTTPResponseBody<any>>(`${config.apiUrl}/transactions/${transactionId}/attachment`, { attachment })

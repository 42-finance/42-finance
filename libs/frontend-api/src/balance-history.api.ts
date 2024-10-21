import { BalanceHistory } from 'frontend-types'

import { config } from './config'
import { del, get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

type BalanceHistoryQuery = {
  accountIds?: string[] | null
  startDate?: Date | null
}

export const getBalanceHistory = async (query: BalanceHistoryQuery = {}) => {
  const url = new URL(`${config.apiUrl}/balance-history`)
  const searchParams = new URLSearchParams()
  if (query.accountIds) {
    searchParams.append('accountIds', query.accountIds.join(','))
  }
  if (query.startDate) {
    searchParams.append('startDate', query.startDate.toISOString())
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<BalanceHistory[]>>(url.toString())
}

export type EditBalanceHistoryRequest = {
  date: Date
  currentBalance: number
}

type EditBalanceHistoryResponse = {
  affected: number
}

export const editBalanceHistory = async (accountId: string, body: EditBalanceHistoryRequest) =>
  patch<HTTPResponseBody<EditBalanceHistoryResponse>>(`${config.apiUrl}/balance-history/${accountId}`, body)

export type DeleteBalanceHistoryRequest = {
  date: Date
}

type DeleteBalanceHistoryResponse = {
  affected: number
}

export const deleteBalanceHistory = async (accountId: string, body: DeleteBalanceHistoryRequest) =>
  del<HTTPResponseBody<DeleteBalanceHistoryResponse>>(`${config.apiUrl}/balance-history/${accountId}`, body)

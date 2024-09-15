import { BalanceHistory } from 'frontend-types'

import { config } from './config'
import { get } from './http'
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

import { Bill } from 'frontend-types'
import _ from 'lodash'

import { config } from './config'
import { get } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getBill = async (billId: number) => get<HTTPResponseBody<Bill>>(`${config.apiUrl}/bills/${billId}`)

type BillsQuery = {
  search?: string | null
  startDate?: Date | null
  accountId?: string | null
}

export const getBills = async (query: BillsQuery = {}) => {
  const url = new URL(`${config.apiUrl}/bills`)
  const searchParams = new URLSearchParams()
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  if (query.startDate) {
    searchParams.append('startDate', query.startDate.toISOString())
  }
  if (query.accountId) {
    searchParams.append('accountId', query.accountId)
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<Bill[]>>(url.toString())
}

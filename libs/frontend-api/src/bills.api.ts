import { Bill } from 'frontend-types'
import _ from 'lodash'

import { config } from './config'
import { del, get, patch, post } from './http'
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

export type AddBillRequest = {
  balance: number
  issueDate: Date
  dueDate: Date
  minimumPaymentAmount: number | null
  accountId: string
}

export const addBill = async (body: AddBillRequest) => post<HTTPResponseBody<Bill>>(`${config.apiUrl}/bills`, body)

export type EditBillRequest = {
  balance?: number
  issueDate?: Date
  dueDate?: Date
  minimumPaymentAmount?: number | null
  accountId?: string
}

export const editBill = async (billId: number, body: EditBillRequest) =>
  patch<HTTPResponseBody<Bill>>(`${config.apiUrl}/bills/${billId}`, body)

type DeleteBillResponse = {
  affected: number
}

export const deleteBill = async (billId: number) =>
  del<HTTPResponseBody<DeleteBillResponse>>(`${config.apiUrl}/bills/${billId}`)

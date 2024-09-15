import { Merchant } from 'frontend-types'
import _ from 'lodash'

import { config } from './config'
import { del, get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getMerchant = async (merchantId: number) =>
  get<HTTPResponseBody<Merchant>>(`${config.apiUrl}/merchants/${merchantId}`)

type MerchantsQuery = {
  search?: string | null
}

export const getMerchants = async (query: MerchantsQuery = {}) => {
  const url = new URL(`${config.apiUrl}/merchants`)
  const searchParams = new URLSearchParams()
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<Merchant[]>>(url.toString())
}
export type EditMerchantRequest = {
  name?: string
}

export const editMerchant = async (merchantId: number, body: EditMerchantRequest) =>
  patch<HTTPResponseBody<Merchant>>(`${config.apiUrl}/merchants/${merchantId}`, body)

type DeleteMerchantResponse = {
  affected: number
}

export const deleteMerchant = async (merchantId: number) =>
  del<HTTPResponseBody<DeleteMerchantResponse>>(`${config.apiUrl}/merchants/${merchantId}`)

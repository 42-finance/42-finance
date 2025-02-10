import { PlaidProduct } from 'shared-types'

import { config } from './config'
import { get, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

type LinkTokenQuery = {
  connectionId?: string
  platform?: string
  product?: PlaidProduct
}

type LinkTokenResponse = {
  linkToken: string
  connectionLimitReached: boolean
}

export const getLinkToken = async (query: LinkTokenQuery = {}) => {
  const url = new URL(`${config.apiUrl}/plaid/linkToken`)
  const searchParams = new URLSearchParams()
  if (query.connectionId) {
    searchParams.append('connectionId', query.connectionId)
  }
  if (query.platform) {
    searchParams.append('platform', query.platform)
  }
  if (query.product) {
    searchParams.append('product', query.product)
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<LinkTokenResponse>>(url.toString())
}

export type CreateAccessTokenRequest = {
  publicToken: string
  institutionId: string
  accounts: any[]
}

type CreateAccessTokenResponse = {
  message: string
}

export const createAccessToken = async (body: CreateAccessTokenRequest) =>
  post<HTTPResponseBody<CreateAccessTokenResponse>>(`${config.apiUrl}/plaid/accessToken`, body)

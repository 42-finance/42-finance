import { User } from 'frontend-types'
import { CurrencyCode } from 'shared-types'

import { config } from './config'
import { del, get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getUser = async () => get<HTTPResponseBody<User>>(`${config.apiUrl}/users`)

export type EditUserRequest = {
  name?: string
  phone?: string | null
  currencyCode?: CurrencyCode
  hideGettingStarted?: boolean
  hideWhatsNew?: boolean
  hideCommunity?: boolean
  hideOpenSource?: boolean
}

export const editUser = async (body: EditUserRequest) => patch<HTTPResponseBody<User>>(`${config.apiUrl}/users`, body)

export const disconnectBankAccount = async () =>
  patch<HTTPResponseBody<User>>(`${config.apiUrl}/users/disconnectBankAccount`, {})

type DeleteUserResponse = {
  affected: number
}

export const deleteUser = async () => del<HTTPResponseBody<DeleteUserResponse>>(`${config.apiUrl}/users`, {})

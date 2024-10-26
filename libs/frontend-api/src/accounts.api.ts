import { Account } from 'frontend-types'
import { AccountSubType, AccountType, CurrencyCode, WalletType } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getAccount = async (accountId: string) =>
  get<HTTPResponseBody<Account>>(`${config.apiUrl}/accounts/${accountId}`)

export const getAccounts = async () => get<HTTPResponseBody<Account[]>>(`${config.apiUrl}/accounts`)

export type AddAccountRequest = {
  name: string
  type: AccountType
  subType: AccountSubType
  currentBalance: number | null
  currencyCode: CurrencyCode
  accountGroupId?: number | null
  walletType?: WalletType | null
  walletAddress?: string | null
  vehicleVin?: string | null
  vehicleMileage?: number | null
  propertyAddress?: string | null
}

export const addAccount = async (body: AddAccountRequest) =>
  post<HTTPResponseBody<Account>>(`${config.apiUrl}/accounts`, body)

export type EditAccountRequest = {
  name?: string
  type?: AccountType
  subType?: AccountSubType
  currentBalance?: number | null
  currencyCode?: CurrencyCode
  accountGroupId?: number | null
}

export const editAccount = async (accountId: string, body: EditAccountRequest) =>
  patch<HTTPResponseBody<Account>>(`${config.apiUrl}/accounts/${accountId}`, body)

type DeleteAccountResponse = {
  affected: number
}

export const deleteAccount = async (accountId: string) =>
  del<HTTPResponseBody<DeleteAccountResponse>>(`${config.apiUrl}/accounts/${accountId}`)

export const refreshAccount = async (accountId: string) =>
  patch<HTTPResponseBody<any>>(`${config.apiUrl}/accounts/${accountId}/refresh`, {})

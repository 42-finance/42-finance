import { Account } from 'frontend-types'
import { AccountSubType, AccountType, CurrencyCode, WalletType } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getAccount = async (accountId: string) =>
  get<HTTPResponseBody<Account>>(`${config.apiUrl}/accounts/${accountId}`)

type AccountsQuery = {
  hideFromAccountsList?: boolean
  hideFromNetWorth?: boolean
  hideFromBudget?: boolean
}

export const getAccounts = async (query: AccountsQuery = {}) => {
  const url = new URL(`${config.apiUrl}/accounts`)
  const searchParams = new URLSearchParams()
  if (query.hideFromAccountsList != null) {
    searchParams.append('hideFromAccountsList', query.hideFromAccountsList.toString())
  }
  if (query.hideFromNetWorth != null) {
    searchParams.append('hideFromNetWorth', query.hideFromNetWorth.toString())
  }
  if (query.hideFromBudget != null) {
    searchParams.append('hideFromBudget', query.hideFromBudget.toString())
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<Account[]>>(url.toString())
}

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
  hideFromAccountsList: boolean
  hideFromNetWorth: boolean
  hideFromBudget: boolean
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
  hideFromAccountsList?: boolean
  hideFromNetWorth?: boolean
  hideFromBudget?: boolean
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

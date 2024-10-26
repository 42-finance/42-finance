import { AccountGroup } from 'frontend-types'
import { AccountGroupType } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getAccountGroup = async (accountGroupId: number) =>
  get<HTTPResponseBody<AccountGroup>>(`${config.apiUrl}/account-groups/${accountGroupId}`)

export const getAccountGroups = async () => get<HTTPResponseBody<AccountGroup[]>>(`${config.apiUrl}/account-groups`)

export type AddAccountGroupRequest = {
  name: string
  type: AccountGroupType
}

export const addAccountGroup = async (body: AddAccountGroupRequest) =>
  post<HTTPResponseBody<AccountGroup>>(`${config.apiUrl}/account-groups`, body)

export type EditAccountGroupRequest = {
  name?: string
  type?: AccountGroupType
}

export const editAccountGroup = async (accountGroupId: number, body: EditAccountGroupRequest) =>
  patch<HTTPResponseBody<AccountGroup>>(`${config.apiUrl}/account-groups/${accountGroupId}`, body)

type DeleteAccountGroupResponse = {
  affected: number
}

export const deleteAccountGroup = async (accountGroupId: number) =>
  del<HTTPResponseBody<DeleteAccountGroupResponse>>(`${config.apiUrl}/account-groups/${accountGroupId}`)

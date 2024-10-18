import { Group } from 'frontend-types'
import _ from 'lodash'
import { BudgetType, CategoryType } from 'shared-types'

import { config } from './config'
import { del, get, patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getGroup = async (groupId: number) => get<HTTPResponseBody<Group>>(`${config.apiUrl}/groups/${groupId}`)

type GroupsQuery = {
  search?: string | null
  showHidden?: boolean | null
}

export const getGroups = async (query: GroupsQuery = {}) => {
  const url = new URL(`${config.apiUrl}/groups`)
  const searchParams = new URLSearchParams()
  if (query.search && !_.isEmpty(query.search)) {
    searchParams.append('search', query.search)
  }
  if (query.showHidden) {
    searchParams.append('showHidden', query.showHidden.toString())
  }
  url.search = searchParams.toString()
  return get<HTTPResponseBody<Group[]>>(url.toString())
}

export type AddGroupRequest = {
  name: string
  type: CategoryType
  budgetType: BudgetType
  hideFromBudget: boolean
  rolloverBudget: boolean
}

export const addGroup = async (body: AddGroupRequest) => post<HTTPResponseBody<Group>>(`${config.apiUrl}/groups`, body)

export type EditGroupRequest = {
  name?: string
  type?: CategoryType
  budgetType?: BudgetType
  hideFromBudget?: boolean
  rolloverBudget?: boolean
  hidden?: boolean
}

export const editGroup = async (groupId: number, body: EditGroupRequest) =>
  patch<HTTPResponseBody<Group>>(`${config.apiUrl}/groups/${groupId}`, body)

type DeleteGroupResponse = {
  affected: number
}

type DeleteGroupRequest = {
  newGroupId: number
}

export const deleteGroup = async (groupId: number, body: DeleteGroupRequest) =>
  del<HTTPResponseBody<DeleteGroupResponse>>(`${config.apiUrl}/groups/${groupId}`, body)

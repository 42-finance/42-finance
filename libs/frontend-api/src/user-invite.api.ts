import { User } from 'frontend-types'
import { UserPermission } from 'shared-types'

import { config } from './config'
import { del, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export type InviteUserRequest = {
  email: string
  permission: UserPermission
}

export const addUserInvite = async (body: InviteUserRequest) =>
  post<HTTPResponseBody<User>>(`${config.apiUrl}/user-invites`, body)

type DeleteUserInviteResponse = {
  affected: number
}

export type DeleteUserInviteRequest = {
  email: string
}

export const deleteUserInvite = async (body: DeleteUserInviteRequest) =>
  del<HTTPResponseBody<DeleteUserInviteResponse>>(`${config.apiUrl}/user-invites`, body)

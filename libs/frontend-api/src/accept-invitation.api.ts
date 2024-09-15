import { User } from 'frontend-types'

import { config } from './config'
import { post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export type AcceptInvitationResponse = {
  token: string
  user: User
}

export type AcceptInvitationRequest = {
  token: string
  name: string
  email: string
  password: string
}

export const acceptInvitation = async (body: AcceptInvitationRequest) =>
  post<HTTPResponseBody<AcceptInvitationResponse>>(`${config.apiUrl}/accept-invitation`, body)

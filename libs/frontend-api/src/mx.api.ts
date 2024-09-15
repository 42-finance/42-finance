import { config } from './config'
import { get, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getMxConnectUrl = async () => get<HTTPResponseBody<string>>(`${config.apiUrl}/mx/connect`)

export const mxMemberCreated = async (memberId: string) =>
  post<HTTPResponseBody<object>>(`${config.apiUrl}/mx/member`, { memberId })

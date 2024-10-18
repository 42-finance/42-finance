import { config } from './config'
import { get } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export type SessionTokenResponse = {
  token: string
}

export const getSessionToken = () => get<HTTPResponseBody<SessionTokenResponse>>(`${config.apiUrl}/quiltt/token`)

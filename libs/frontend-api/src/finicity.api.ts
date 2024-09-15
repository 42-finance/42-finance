import { config } from './config'
import { get, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getFinicityConnectUrl = async () => get<HTTPResponseBody<string>>(`${config.apiUrl}/finicity/connect`)

export const refreshFinicityData = async () => post<HTTPResponseBody<string>>(`${config.apiUrl}/finicity/refresh`, {})

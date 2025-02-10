import { Connection } from 'frontend-types'

import { config } from './config'
import { del, get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getConnection = async (connectionId: number) =>
  get<HTTPResponseBody<Connection>>(`${config.apiUrl}/connections/${connectionId}`)

export const getConnections = async () => get<HTTPResponseBody<Connection[]>>(`${config.apiUrl}/connections`)

export type EditConnectionRequest = {
  needsTokenRefresh?: boolean
}

export const editConnection = async (connectionId: string, body: EditConnectionRequest) =>
  patch<HTTPResponseBody<Connection>>(`${config.apiUrl}/connections/${connectionId}`, body)

type DeleteConnectionResponse = {
  affected: number
}

export type DeleteConnectionRequest = {
  keepData?: boolean
}

export const deleteConnection = async (connectionId: string, body: DeleteConnectionRequest) =>
  del<HTTPResponseBody<DeleteConnectionResponse>>(`${config.apiUrl}/connections/${connectionId}`, body)

import { HouseholdUser } from 'frontend-types'

import { config } from './config'
import { del, get } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getHouseholdUsers = async () => get<HTTPResponseBody<HouseholdUser[]>>(`${config.apiUrl}/household/users`)

type DeleteHouseholdUserResponse = {
  affected: number
}

export const deleteHouseholdUser = async (userId: number) =>
  del<HTTPResponseBody<DeleteHouseholdUserResponse>>(`${config.apiUrl}/household/users/${userId}`)

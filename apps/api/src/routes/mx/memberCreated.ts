import { Boom } from '@hapi/boom'
import { Connection, Household, dataSource } from 'database'
import { Request, Response } from 'express'
import { mxClient, updateTransactions } from 'mx-helpers'
import { ConnectionType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type MemberCreatedRequest = {
  memberId: string
}

export const memberCreated = async (
  request: Request<object, object, MemberCreatedRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { memberId } = request.body

  const household = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .where('household.id = :householdId', { householdId })
    .getOneOrFail()

  if (household.mxUserId == null) {
    throw new Boom('Household is not linked to a MX user', { statusCode: 409 })
  }

  const memberResponse = await mxClient.readMember(memberId, household.mxUserId)

  const institutionCode = memberResponse.data.member?.institution_code

  if (institutionCode == null) {
    throw new Boom('Invalid institution. Code cannot be null', { statusCode: 409 })
  }

  const institutionResponse = await mxClient.readInstitution(institutionCode)

  const institutionName = institutionResponse.data.institution?.name

  if (institutionName == null) {
    throw new Boom('Invalid institution. Name cannot be null', { statusCode: 409 })
  }

  const connection = await dataSource.getRepository(Connection).save({
    id: memberId,
    institutionId: institutionCode,
    institutionName,
    institutionLogo: institutionResponse.data.institution?.medium_logo_url,
    type: ConnectionType.Mx,
    householdId
  })

  response.send({
    errors: [],
    payload: {
      message: 'Account linked successfully. Your accounts and transactions are syncing and will be available shortly.'
    }
  })

  await updateTransactions(connection.id)
}

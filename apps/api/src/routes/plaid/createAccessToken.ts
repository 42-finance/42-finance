import { Boom } from '@hapi/boom'
import { Account, Connection, dataSource } from 'database'
import { Request, Response } from 'express'
import { CountryCode } from 'plaid'
import { plaidClient, updateTransactions } from 'plaid-helpers'
import { ConnectionType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type PlaidAccount = {
  verificationStatus: string
  type: string
  mask: string
  name: string
  subtype: string
  id: string
}

type CreateAccessTokenRequest = {
  publicToken: string
  institutionId: string
  accounts: PlaidAccount[]
}

export const createAccessToken = async (
  request: Request<object, object, CreateAccessTokenRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { publicToken, institutionId, accounts } = request.body

  const existingConnection = await dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .leftJoinAndMapMany('connection.accounts', Account, 'account', 'account.connectionId = connection.id')
    .andWhere('connection.householdId = :householdId', { householdId })
    .andWhere('connection.institutionId = :institutionId', { institutionId })
    .getOne()

  if (existingConnection) {
    if (accounts) {
      for (const account of accounts) {
        const existingAccount = existingConnection.accounts.find(
          (a) => a.name === account.name && a.mask === account.mask
        )
        if (existingAccount) {
          throw new Boom('A connection with this institution and account already exists', { statusCode: 409 })
        }
      }
    } else {
      throw new Boom('A connection with this institution already exists', { statusCode: 409 })
    }
  }

  const tokenRes = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken
  })

  const institutionRes = await plaidClient.institutionsGetById({
    institution_id: institutionId,
    country_codes: [CountryCode.Ca, CountryCode.Us],
    options: {
      include_optional_metadata: true
    }
  })

  const connection = await dataSource.getRepository(Connection).save({
    id: tokenRes.data.item_id,
    institutionId,
    institutionName: institutionRes.data.institution.name,
    institutionLogo: institutionRes.data.institution.logo,
    accessToken: tokenRes.data.access_token,
    type: ConnectionType.Plaid,
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

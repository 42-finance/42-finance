import { Account, Connection, dataSource } from 'database'
import { Request, Response } from 'express'
import { updateLiabilities, updateTransactions } from 'plaid-helpers'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const refreshAccount = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const account = await dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('account.id = :id', { id })
    .andWhere('account.householdId = :householdId', { householdId })
    .getOneOrFail()

  if (account.connection?.accessToken) {
    try {
      await updateTransactions(account.connection.id)
    } catch {
      await dataSource.getRepository(Connection).update(account.connection.id, { needsTokenRefresh: true })
      return response.status(403).send({
        errors: [`Connection credentials need to be updated. Update the connection to resume syncing.`],
        payload: {}
      })
    }

    try {
      await updateLiabilities(account.connection.id)
    } catch (e) {
      console.log(e)
    }
  }

  return response.json({
    errors: [],
    payload: {}
  })
}

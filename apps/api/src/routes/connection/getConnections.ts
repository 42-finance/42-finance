import { Account, Connection, dataSource } from 'database'
import { Request, Response } from 'express'
import { omit } from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getConnections = async (request: Request, response: Response<HTTPResponseBody>) => {
  const { householdId } = request

  const connections = await dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .leftJoinAndMapMany('connection.accounts', Account, 'account', 'account.connectionId = connection.id')
    .where('connection.householdId = :householdId', { householdId })
    .addOrderBy('connection.institutionId')
    .getMany()

  return response.send({
    errors: [],
    payload: connections.map((c) => omit(c, ['accessToken', 'transactionsCursor']))
  })
}

import { Connection, dataSource } from 'database'
import { Request, Response } from 'express'
import { updateLiabilities, updateTransactions } from 'plaid-helpers'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateConnectionRequest = {
  needsTokenRefresh?: boolean
}

export const updateConnection = async (
  request: Request<{ id: string }, {}, UpdateConnectionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { needsTokenRefresh } = request.body

  const connection = await dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .where('connection.id = :id', { id })
    .andWhere('connection.householdId = :householdId', { householdId })
    .getOne()

  if (!connection) {
    return response.status(404).json({
      errors: [`Connection with id ${id} not found`],
      payload: {}
    })
  }

  const result = await dataSource.getRepository(Connection).update(connection.id, {
    needsTokenRefresh
  })

  response.json({
    errors: [],
    payload: result
  })

  await updateTransactions(connection.id)
  await updateLiabilities(connection.id)
}

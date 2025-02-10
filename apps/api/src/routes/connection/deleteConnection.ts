import { Connection, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { deletePlaidConnection } from '../../utils/connection.utils'

type DeleteConnectionRequest = {
  keepData: boolean
}

export const deleteConnection = async (
  request: Request<{ id: string }, {}, DeleteConnectionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { keepData } = request.body

  const connection = await dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .where('connection.id = :id', { id })
    .andWhere('connection.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    const result = await deletePlaidConnection(connection, keepData, entityManager)

    return response.json({
      errors: [],
      payload: result
    })
  })
}

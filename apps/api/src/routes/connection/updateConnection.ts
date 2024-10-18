import { Connection, dataSource } from 'database'
import { Request, Response } from 'express'
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

  try {
    const result = await dataSource.getRepository(Connection).update(connection.id, {
      needsTokenRefresh
    })
    return response.json({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

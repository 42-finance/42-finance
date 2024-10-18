import { Tag, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getTag = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const tag = await dataSource
    .getRepository(Tag)
    .createQueryBuilder('tag')
    .andWhere('tag.householdId = :householdId', { householdId })
    .andWhere('tag.id = :id', { id })
    .getOneOrFail()

  return response.send({
    errors: [],
    payload: tag
  })
}

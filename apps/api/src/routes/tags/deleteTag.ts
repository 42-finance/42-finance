import { Tag, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteTag = async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const { householdId } = request

  await dataSource
    .getRepository(Tag)
    .createQueryBuilder('tag')
    .andWhere('tag.id = :id', { id })
    .andWhere('tag.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(Tag).delete(id)

  return response.send({
    errors: [],
    payload: result
  })
}

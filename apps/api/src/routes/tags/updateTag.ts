import { Tag, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateTagRequest = {
  name?: string
  color?: string
}

export const updateTag = async (
  request: Request<{ id: string }, object, UpdateTagRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name, color } = request.body

  const tag = await dataSource
    .getRepository(Tag)
    .createQueryBuilder('tag')
    .where('tag.id = :id', { id })
    .andWhere('tag.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(Tag).update(tag.id, {
    name,
    color
  })

  return response.json({
    errors: [],
    payload: result
  })
}

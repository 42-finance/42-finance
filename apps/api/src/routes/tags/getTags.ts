import { Tag, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export type TagQueryParams = {
  search?: string | null
}

export const getTags = async (
  request: Request<object, object, object, TagQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { search } = request.query

  let tagQuery = dataSource
    .getRepository(Tag)
    .createQueryBuilder('tag')
    .loadRelationCountAndMap('tag.transactionCount', 'tag.transactions')
    .andWhere('tag.householdId = :householdId', { householdId })

  if (search) {
    tagQuery = tagQuery.andWhere(`tag.name ILIKE :search`, { search: `%${search}%` })
  }

  const tags = await tagQuery.getMany()

  return response.send({
    errors: [],
    payload: tags
  })
}

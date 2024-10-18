import { Tag, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateTagRequest = {
  name: string
  color: string
}

export const createTag = async (
  request: Request<object, object, CreateTagRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { name, color } = request.body

  const result = await dataSource.getRepository(Tag).save({
    name,
    color,
    householdId
  })

  return response.json({
    errors: [],
    payload: result
  })
}

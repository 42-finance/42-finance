import { Rule, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteRule = async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const { householdId } = request

  const rule = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .where('rule.id = :id', { id })
    .andWhere('rule.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(Rule).remove(rule)

  return response.send({
    errors: [],
    payload: result
  })
}

import { Goal, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteGoal = async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const { householdId } = request

  const goal = await dataSource
    .getRepository(Goal)
    .createQueryBuilder('goal')
    .where('goal.id = :id', { id })
    .andWhere('goal.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(Goal).remove(goal)

  return response.send({
    errors: [],
    payload: result
  })
}

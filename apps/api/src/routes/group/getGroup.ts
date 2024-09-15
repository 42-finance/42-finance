import { Category, Group, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getGroup = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const group = await dataSource
    .getRepository(Group)
    .createQueryBuilder('group')
    .leftJoinAndMapMany('group.categories', Category, 'category', 'category.groupId = group.id')
    .where('group.householdId = :householdId', { householdId })
    .andWhere('group.id = :id', { id })
    .getOneOrFail()

  return response.send({
    errors: [],
    payload: group
  })
}

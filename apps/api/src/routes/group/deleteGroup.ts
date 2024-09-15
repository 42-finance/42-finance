import { Boom } from '@hapi/boom'
import { Category, Group, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type DeleteGroupRequest = {
  newGroupId: number
}

export const deleteGroup = async (
  request: Request<{ id: number }, object, DeleteGroupRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { householdId } = request
  const { newGroupId } = request.body

  if (Number(newGroupId) === Number(id)) {
    throw new Boom('Cannot reassign to this group', { statusCode: 409 })
  }

  const group = await dataSource
    .getRepository(Group)
    .createQueryBuilder('group')
    .leftJoinAndMapMany('group.categories', Category, 'category', 'category.groupId = group.id')
    .where('group.id = :id', { id })
    .andWhere('group.householdId = :householdId', { householdId })
    .getOneOrFail()

  const newGroup = await dataSource
    .getRepository(Group)
    .createQueryBuilder('group')
    .where('group.id = :newGroupId', { newGroupId })
    .andWhere('group.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    await entityManager
      .createQueryBuilder()
      .update(Category)
      .set({
        groupId: newGroup.id
      })
      .where('householdId = :householdId', { householdId })
      .andWhere('groupId = :groupId', { groupId: id })
      .execute()

    const result = await entityManager.getRepository(Group).remove(group)

    return response.send({
      errors: [],
      payload: result
    })
  })
}

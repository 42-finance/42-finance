import { Boom } from '@hapi/boom'
import { Category, Group, Transaction, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type DeleteCategoryRequest = {
  mapToCategoryId: number
}

export const deleteCategory = async (
  request: Request<{ id: number }, object, DeleteCategoryRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { householdId } = request
  const { mapToCategoryId } = request.body

  if (Number(mapToCategoryId) === Number(id)) {
    throw new Boom('Cannot reassign to this category', { statusCode: 409 })
  }

  const category = await dataSource
    .getRepository(Category)
    .createQueryBuilder('category')
    .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
    .where('category.id = :id', { id })
    .andWhere('category.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    const newCategory = await dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :mapToCategoryId', { mapToCategoryId })
      .andWhere('category.householdId = :householdId', { householdId })
      .getOneOrFail()

    await entityManager
      .createQueryBuilder()
      .update(Transaction)
      .set({
        categoryId: newCategory.id
      })
      .where('householdId = :householdId', { householdId })
      .andWhere('categoryId = :categoryId', { categoryId: category.id })
      .execute()

    await entityManager
      .createQueryBuilder()
      .update(Category)
      .set({
        mapToCategoryId: newCategory.id
      })
      .where('householdId = :householdId', { householdId })
      .andWhere('mapToCategoryId = :mapToCategoryId', { mapToCategoryId: category.id })
      .execute()

    let result

    if (category.systemCategory) {
      result = await entityManager.getRepository(Category).update(category.id, { mapToCategoryId })
    } else {
      result = await entityManager.getRepository(Category).remove(category)
    }

    return response.send({
      errors: [],
      payload: result
    })
  })
}

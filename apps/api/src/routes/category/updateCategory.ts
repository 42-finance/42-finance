import { Category, Group, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateCategoryRequest = {
  name?: string
  icon?: string
  mapToCategoryId?: number
  groupId?: number
  hideFromBudget?: boolean
  rolloverBudget?: boolean
}

export const updateCategory = async (
  request: Request<{ id: string }, object, UpdateCategoryRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name, icon, mapToCategoryId, groupId, hideFromBudget, rolloverBudget } = request.body

  const category = await dataSource
    .getRepository(Category)
    .createQueryBuilder('category')
    .where('category.id = :id', { id })
    .andWhere('category.householdId = :householdId', { householdId })
    .getOne()

  if (!category) {
    return response.status(404).json({
      errors: [`Category with id ${id} not found`],
      payload: {}
    })
  }

  if (groupId) {
    const group = await dataSource
      .getRepository(Group)
      .createQueryBuilder('group')
      .where('group.id = :groupId', { groupId })
      .andWhere('group.householdId = :householdId', { householdId })
      .getOne()

    if (!group) {
      return response.status(404).json({
        errors: [`Group with id ${id} not found`],
        payload: {}
      })
    }
  }

  if (mapToCategoryId) {
    const category = await dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :mapToCategoryId', { mapToCategoryId })
      .andWhere('category.householdId = :householdId', { householdId })
      .getOne()

    if (!category) {
      return response.status(404).json({
        errors: [`Category with id ${mapToCategoryId} not found`],
        payload: {}
      })
    }
  }

  try {
    const result = await dataSource.getRepository(Category).update(category.id, {
      name,
      icon,
      mapToCategoryId,
      groupId,
      hideFromBudget,
      rolloverBudget
    })
    return response.json({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

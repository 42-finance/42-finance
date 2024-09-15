import { Group, dataSource } from 'database'
import { Request, Response } from 'express'
import { BudgetType, CategoryType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateGroupRequest = {
  name?: string
  type?: CategoryType
  budgetType?: BudgetType
  hideFromBudget?: boolean
  rolloverBudget?: boolean
}

export const updateGroup = async (
  request: Request<{ id: string }, object, UpdateGroupRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name, type, budgetType, hideFromBudget, rolloverBudget } = request.body

  const group = await dataSource
    .getRepository(Group)
    .createQueryBuilder('group')
    .where('group.id = :id', { id })
    .andWhere('group.householdId = :householdId', { householdId })
    .getOne()

  if (!group) {
    return response.status(404).json({
      errors: [`Group with id ${id} not found`],
      payload: {}
    })
  }

  try {
    const result = await dataSource.getRepository(Group).update(group.id, {
      name,
      type,
      budgetType,
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

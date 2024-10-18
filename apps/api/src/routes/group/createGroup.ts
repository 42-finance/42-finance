import { Group, dataSource } from 'database'
import { Request, Response } from 'express'
import { BudgetType, CategoryType } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateGroupRequest = {
  name: string
  type: CategoryType
  budgetType: BudgetType
  hideFromBudget: boolean
  rolloverBudget: boolean
}

export const createGroup = async (
  request: Request<{ id: string }, {}, CreateGroupRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { name, type, budgetType, hideFromBudget, rolloverBudget } = request.body

  try {
    const result = await dataSource.getRepository(Group).save({
      name,
      type,
      icon: '',
      budgetType,
      hideFromBudget,
      rolloverBudget,
      householdId
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

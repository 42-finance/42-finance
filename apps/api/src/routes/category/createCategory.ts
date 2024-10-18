import { Category, dataSource } from 'database'
import { Request, Response } from 'express'
import { CategoryType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateCategoryRequest = {
  name: string
  icon: string
  type: CategoryType
  groupId: number
  hideFromBudget: boolean
  rolloverBudget: boolean
}

export const createCategory = async (
  request: Request<{ id: string }, {}, CreateCategoryRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { name, icon, type, groupId, hideFromBudget, rolloverBudget } = request.body

  try {
    const result = await dataSource.getRepository(Category).save({
      name,
      icon,
      type,
      groupId,
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

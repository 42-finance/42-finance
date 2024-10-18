import { Budget, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateBudgetRequest = {
  categoryId: number
  amount: number
}

export const updateBudget = async (
  request: Request<object, object, UpdateBudgetRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { categoryId, amount } = request.body

  const budget = await dataSource
    .getRepository(Budget)
    .createQueryBuilder('budget')
    .andWhere('budget.categoryId = :categoryId', { categoryId })
    .andWhere('budget.householdId = :householdId', { householdId })
    .getOne()

  let result

  if (budget && amount === 0) {
    result = await dataSource.getRepository(Budget).delete(budget.id)
  } else {
    result = await dataSource.getRepository(Budget).save({
      id: budget?.id,
      categoryId,
      amount,
      householdId
    })
  }

  return response.json({
    errors: [],
    payload: result
  })
}

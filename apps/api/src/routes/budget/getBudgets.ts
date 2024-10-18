import { Budget, Category, Group, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getBudgets = async (request: Request<{}, {}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request

  const budgets = await dataSource
    .getRepository(Budget)
    .createQueryBuilder('budget')
    .leftJoinAndMapOne('budget.category', Category, 'category', 'category.id = budget.categoryId')
    .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
    .where('budget.householdId = :householdId', { householdId })
    .andWhere('category.mapToCategoryId IS NULL')
    .andWhere('category.hideFromBudget = :hideFromBudget', { hideFromBudget: false })
    .andWhere('group.hideFromBudget = :hideFromBudget', { hideFromBudget: false })
    .addOrderBy('budget.categoryId')
    .getMany()

  return response.send({
    errors: [],
    payload: budgets
  })
}

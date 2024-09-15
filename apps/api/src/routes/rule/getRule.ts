import { Account, Category, Rule, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getRule = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const rule = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .leftJoinAndMapOne('rule.category', Category, 'category', 'category.id = rule.categoryId')
    .leftJoinAndMapOne('rule.account', Account, 'account', 'account.id = rule.accountId')
    .leftJoinAndMapOne('rule.newCategory', Category, 'newCategory', 'newCategory.id = rule.newCategoryId')
    .where('rule.householdId = :householdId', { householdId })
    .andWhere('rule.id = :id', { id })
    .getOneOrFail()

  return response.send({
    errors: [],
    payload: rule
  })
}

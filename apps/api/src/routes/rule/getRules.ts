import { Account, Category, dataSource, Rule } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type RulesQueryParams = {
  search?: string | null
}

export const getRules = async (
  request: Request<{}, {}, {}, RulesQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { search } = request.query

  let rulesQuery = dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .leftJoinAndMapOne('rule.category', Category, 'category', 'category.id = rule.categoryId')
    .leftJoinAndMapOne('rule.account', Account, 'account', 'account.id = rule.accountId')
    .leftJoinAndMapOne('rule.newCategory', Category, 'newCategory', 'newCategory.id = rule.newCategoryId')
    .where('rule.householdId = :householdId', { householdId })
    .addOrderBy('rule.id')

  if (search) {
    rulesQuery = rulesQuery.andWhere(
      `(rule.merchantName ILIKE :search OR 
        rule.merchantOriginalStatement ILIKE :search OR 
        rule."amountValue"::text ILIKE :search OR 
        rule."amountValue2"::text ILIKE :search OR 
        category.name ILIKE :search OR 
        account.name ILIKE :search OR 
        rule.newMerchantName ILIKE :search OR 
        newCategory.name ILIKE :search)`,
      { search: `%${search}%` }
    )
  }

  const rules = await rulesQuery.getMany()

  return response.send({
    errors: [],
    payload: rules
  })
}

import { Category, dataSource, Group } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CategoriesQueryParams = {
  search?: string | null
  showHidden?: boolean | null
}

export const getCategories = async (
  request: Request<object, object, object, CategoriesQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { search, showHidden } = request.query

  let categoriesQuery = dataSource
    .getRepository(Category)
    .createQueryBuilder('category')
    .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
    .where('category.householdId = :householdId', { householdId })
    .addOrderBy('category.name')
    .addOrderBy('category.id')

  if (search) {
    categoriesQuery = categoriesQuery.andWhere(`category.name ILIKE :search`, { search: `%${search}%` })
  }

  if (!showHidden) {
    categoriesQuery = categoriesQuery.andWhere(`category.mapToCategoryId IS NULL`)
  }

  const categories = await categoriesQuery.getMany()

  return response.send({
    errors: [],
    payload: categories
  })
}

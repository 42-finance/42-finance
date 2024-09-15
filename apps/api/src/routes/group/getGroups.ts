import { Category, dataSource, Group } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type GroupsQueryParams = {
  search?: string | null
  showHidden?: boolean
}

export const getGroups = async (
  request: Request<object, object, object, GroupsQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { search, showHidden } = request.query

  try {
    let groupsQuery = dataSource
      .getRepository(Group)
      .createQueryBuilder('group')
      .leftJoinAndMapMany('group.categories', Category, 'category', 'category.groupId = group.id')
      .leftJoinAndMapMany('category.group', Group, 'categoryGroup', 'categoryGroup.id = category.groupId')
      .where('group.householdId = :householdId', { householdId })
      .addOrderBy('group.name')
      .addOrderBy('category.name')

    if (search) {
      groupsQuery = groupsQuery.andWhere(`category.name ILIKE :search`, { search: `%${search}%` })
    }

    if (!showHidden) {
      groupsQuery = groupsQuery.andWhere(`category.mapToCategoryId IS NULL`)
    }

    const groups = await groupsQuery.getMany()

    return response.send({
      errors: [],
      payload: groups
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

import { Category, Group, dataSource } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getCategory = async (
  request: Request<{ id: string }, {}, {}, {}>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params

  try {
    const category = await dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
      .where('category.householdId = :householdId', { householdId })
      .andWhere('category.id = :id', { id })
      .getOneOrFail()

    return response.send({
      errors: [],
      payload: category
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

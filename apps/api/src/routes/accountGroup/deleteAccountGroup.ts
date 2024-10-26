import { AccountGroup, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteAccountGroup = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const accountGroup = await dataSource
    .getRepository(AccountGroup)
    .createQueryBuilder('accountGroup')
    .where('accountGroup.id = :id', { id })
    .andWhere('accountGroup.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(AccountGroup).delete(accountGroup.id)

  return response.json({
    errors: [],
    payload: result
  })
}

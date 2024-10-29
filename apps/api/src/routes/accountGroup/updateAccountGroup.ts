import { AccountGroup, dataSource } from 'database'
import { Request, Response } from 'express'
import { AccountGroupType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateAccountGroupRequest = {
  name?: string
  type?: AccountGroupType
  hideFromAccountsList?: boolean
  hideFromNetWorth?: boolean
  hideFromBudget?: boolean
}

export const updateAccountGroup = async (
  request: Request<{ id: string }, object, UpdateAccountGroupRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name, type, hideFromAccountsList, hideFromNetWorth, hideFromBudget } = request.body

  const accountGroup = await dataSource
    .getRepository(AccountGroup)
    .createQueryBuilder('accountGroup')
    .where('accountGroup.id = :id', { id })
    .andWhere('accountGroup.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(AccountGroup).update(accountGroup.id, {
    name,
    type,
    hideFromAccountsList,
    hideFromNetWorth,
    hideFromBudget
  })

  return response.json({
    errors: [],
    payload: result
  })
}

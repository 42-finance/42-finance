import { AccountGroup, dataSource } from 'database'
import { Request, Response } from 'express'
import { AccountGroupType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateAccountGroupRequest = {
  name: string
  type: AccountGroupType
  hideFromAccountsList: boolean
  hideFromNetWorth: boolean
  hideFromBudget: boolean
}

export const createAccountGroup = async (
  request: Request<{ id: string }, object, CreateAccountGroupRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  let { name, type, hideFromAccountsList = false, hideFromNetWorth = false, hideFromBudget = false } = request.body

  const accountGroup = await dataSource.getRepository(AccountGroup).save({
    name,
    type,
    hideFromAccountsList,
    hideFromNetWorth,
    hideFromBudget,
    householdId
  })

  return response.json({
    errors: [],
    payload: accountGroup
  })
}

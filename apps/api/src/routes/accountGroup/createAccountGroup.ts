import { AccountGroup, dataSource } from 'database'
import { Request, Response } from 'express'
import { AccountGroupType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateAccountGroupRequest = {
  name: string
  type: AccountGroupType
}

export const createAccountGroup = async (
  request: Request<{ id: string }, object, CreateAccountGroupRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  let { name, type } = request.body

  const accountGroup = await dataSource.getRepository(AccountGroup).save({
    name,
    type,
    householdId
  })

  return response.json({
    errors: [],
    payload: accountGroup
  })
}

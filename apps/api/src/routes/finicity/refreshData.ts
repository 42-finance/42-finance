import { Boom } from '@hapi/boom'
import { Household, dataSource } from 'database'
import { Request, Response } from 'express'
import { updateFinicityTransactions } from 'finicity-helpers'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const refreshData = async (
  request: Request<object, object, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request

  const household = await dataSource.getRepository(Household).findOneOrFail({ where: { id: householdId } })

  if (household.finicityUserId == null) {
    throw new Boom('Finicity is not configured', { statusCode: 409 })
  }

  response.send({
    errors: [],
    payload: {
      message: 'Account linked successfully. Your accounts and transactions are syncing and will be available shortly.'
    }
  })

  await updateFinicityTransactions(householdId, household.finicityUserId)
}

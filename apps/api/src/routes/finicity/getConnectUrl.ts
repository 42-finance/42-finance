import { Boom } from '@hapi/boom'
import { Household, dataSource } from 'database'
import { Request, Response } from 'express'
import { createFinicityCustomer, finicityLogin, getFinicityUrl } from 'finicity-helpers'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getConnectUrl = async (
  request: Request<object, object, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request

  const household = await dataSource.getRepository(Household).findOneOrFail({ where: { id: householdId } })

  const token = await finicityLogin()

  if (household.finicityUserId == null) {
    const customer = await createFinicityCustomer(householdId, token)
    household.finicityUserId = customer.id
    await dataSource.getRepository(Household).update(householdId, {
      finicityUserId: customer.id
    })
  }

  if (household.finicityUserId == null) {
    throw new Boom('Unable to create Finicity user', { statusCode: 409 })
  }

  const link = await getFinicityUrl(household.finicityUserId, token)

  return response.send({
    errors: [],
    payload: link
  })
}

import { dataSource, Transaction } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<object, object, string[]>, response: Response<HTTPResponseBody>) => {
  const ids = request.body
  const { householdId } = request

  const transactionCount = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .where('transaction.id IN (:...transactionIds)', { transactionIds: ids })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getCount()

  if (transactionCount !== ids.length) {
    return response.status(404).send({
      errors: [`Invalid transaction ids`],
      payload: {}
    })
  }

  const result = await dataSource.getRepository(Transaction).softDelete(ids)

  return response.send({
    errors: [],
    payload: result
  })
}

import { RecurringTransaction, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteRecurringTransaction = async (
  request: Request<{ id: number }>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { householdId } = request

  const transaction = await dataSource
    .getRepository(RecurringTransaction)
    .createQueryBuilder('recurringTransaction')
    .where('recurringTransaction.id = :id', { id })
    .andWhere('recurringTransaction.householdId = :householdId', { householdId })
    .getOne()

  if (!transaction) {
    return response.status(404).send({
      errors: [`Recurring transaction with id ${id} was not found`],
      payload: {}
    })
  }

  const result = await dataSource.getRepository(RecurringTransaction).remove(transaction)

  return response.send({
    errors: [],
    payload: result
  })
}

import { Transaction, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteTransaction = async (request: Request<{ id: number }>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const { householdId } = request

  const transactionRepo = dataSource.getRepository(Transaction)
  const transaction = await transactionRepo
    .createQueryBuilder('transaction')
    .where('transaction.id = :id', { id })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getOne()

  if (!transaction) {
    return response.status(404).send({
      errors: [`Transaction with id ${id} was not found`],
      payload: {}
    })
  }

  try {
    const result = await transactionRepo.softRemove(transaction)
    return response.send({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).send({
      errors: [error.message],
      payload: {}
    })
  }
}

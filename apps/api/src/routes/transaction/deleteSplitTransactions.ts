import { dataSource, Transaction } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteSplitTransactions = async (
  request: Request<{ id: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params

  const transaction = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .leftJoinAndMapMany(
      'transaction.splitTransactions',
      Transaction,
      'splitTransaction',
      'splitTransaction.splitTransactionId = transaction.id'
    )
    .where('transaction.id = :id', { id })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    if (transaction.splitTransactions.length) {
      await entityManager.getRepository(Transaction).delete(transaction.splitTransactions.map((t) => t.id))
    }

    const result = await entityManager.getRepository(Transaction).update(transaction.id, {
      split: false
    })

    return response.json({
      errors: [],
      payload: result
    })
  })
}

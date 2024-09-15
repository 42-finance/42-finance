import { User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { convertTransactionsCurrency } from '../../models/transaction/convertTransactionCurrency'
import { fetchTransactions } from '../../models/transaction/fetchTransactions'
import { TransactionQueryParams } from '../../models/transaction/transactionQueryParams'

export const getTransactions = async (
  request: Request<object, object, object, TransactionQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request

  const transactions = await fetchTransactions(householdId, request.query)

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedTransactions = await convertTransactionsCurrency(transactions, user)

  await dataSource
    .createQueryBuilder()
    .update(User)
    .set({
      lastLoginTime: new Date()
    })
    .where('id = :userId', { userId })
    .execute()

  return response.send({
    errors: [],
    payload: convertedTransactions
  })
}

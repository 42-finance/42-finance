import { User, dataSource } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { convertTransactionsCurrency } from '../../models/transaction/convertTransactionCurrency'
import { fetchTransactions } from '../../models/transaction/fetchTransactions'
import { TransactionQueryParams } from '../../models/transaction/transactionQueryParams'

export const getTransactionsStats = async (
  request: Request<object, object, object, TransactionQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request

  const transactions = await fetchTransactions(householdId, request.query)

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedTransactions = await convertTransactionsCurrency(transactions, user)

  const totalAmount = convertedTransactions.length === 0 ? 0 : _.sumBy(convertedTransactions, 'convertedAmount')
  const averageTransaction = convertedTransactions.length === 0 ? 0 : _.meanBy(convertedTransactions, 'convertedAmount')

  return response.send({
    errors: [],
    payload: {
      totalAmount,
      averageTransaction,
      totalTransactions: convertedTransactions.length
    }
  })
}

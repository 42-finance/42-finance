import { Account, Connection, Merchant, RecurringTransaction, User, dataSource, getExchangeRate } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getRecurringTransactions = async (
  request: Request<object, object, object, object>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request

  const recurringTransactions = await dataSource
    .getRepository(RecurringTransaction)
    .createQueryBuilder('recurringTransaction')
    .leftJoinAndMapOne(
      'recurringTransaction.merchant',
      Merchant,
      'merchant',
      'merchant.id = recurringTransaction.merchantId'
    )
    .leftJoinAndMapOne(
      'recurringTransaction.account',
      Account,
      'account',
      'account.id = recurringTransaction.accountId'
    )
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('recurringTransaction.householdId = :householdId', { householdId })
    .addOrderBy('recurringTransaction.id')
    .getMany()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedTransactions: RecurringTransaction[] = []

  for (const transaction of recurringTransactions.filter((t) => t.account)) {
    let convertedAmount = transaction.amount
    if (user.currencyCode !== transaction.account.currencyCode) {
      const exchangeRate = await getExchangeRate(transaction.account.currencyCode, user.currencyCode)
      convertedAmount *= exchangeRate
    }
    convertedTransactions.push({
      ...transaction,
      convertedAmount
    })
  }

  return response.send({
    errors: [],
    payload: convertedTransactions
  })
}

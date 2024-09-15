import { Account, Category, Merchant, RecurringTransaction, Transaction, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { convertTransactionsCurrency } from '../../models/transaction/convertTransactionCurrency'

export const getRecurringTransaction = async (
  request: Request<{ id: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { id } = request.params

  const recurringTransaction = await dataSource
    .getRepository(RecurringTransaction)
    .createQueryBuilder('recurringTransaction')
    .leftJoinAndMapOne(
      'recurringTransaction.account',
      Account,
      'account',
      'account.id = recurringTransaction.accountId'
    )
    .leftJoinAndMapOne(
      'recurringTransaction.merchant',
      Merchant,
      'merchant',
      'merchant.id = recurringTransaction.merchantId'
    )
    .leftJoinAndMapMany(
      'recurringTransaction.transactions',
      Transaction,
      'transaction',
      'transaction.recurringTransactionId = recurringTransaction.id'
    )
    .leftJoinAndMapOne(
      'transaction.account',
      Account,
      'transactionAccount',
      'transactionAccount.id = transaction.accountId'
    )
    .leftJoinAndMapOne(
      'transaction.category',
      Category,
      'transactionCategory',
      'transactionCategory.id = transaction.categoryId'
    )
    .leftJoinAndMapOne(
      'transaction.merchant',
      Merchant,
      'transactionMerchant',
      'transactionMerchant.id = transaction.merchantId'
    )
    .where('recurringTransaction.householdId = :householdId', { householdId })
    .andWhere('recurringTransaction.id = :id', { id })
    .orderBy('transaction.date', 'DESC')
    .getOneOrFail()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedTransactions = await convertTransactionsCurrency(recurringTransaction.transactions, user)

  return response.send({
    errors: [],
    payload: {
      ...recurringTransaction,
      transactions: convertedTransactions
    }
  })
}

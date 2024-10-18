import {
  Account,
  Category,
  Connection,
  Merchant,
  RecurringTransaction,
  Rule,
  Tag,
  Transaction,
  dataSource
} from 'database'
import { shouldApplyRule } from 'database/src/utils/rule.utils'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getTransaction = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const transaction = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .leftJoinAndMapOne('transaction.account', Account, 'account', 'account.id = transaction.accountId')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .leftJoinAndMapOne('transaction.category', Category, 'category', 'category.id = transaction.categoryId')
    .leftJoinAndMapOne('transaction.merchant', Merchant, 'merchant', 'merchant.id = transaction.merchantId')
    .leftJoinAndMapMany(
      'transaction.splitTransactions',
      Transaction,
      'splitTransaction',
      'splitTransaction.splitTransactionId = transaction.id'
    )
    .leftJoinAndMapOne(
      'splitTransaction.category',
      Category,
      'splitCategory',
      'splitCategory.id = splitTransaction.categoryId'
    )
    .leftJoinAndMapOne(
      'splitTransaction.merchant',
      Merchant,
      'splitMerchant',
      'splitMerchant.id = splitTransaction.merchantId'
    )
    .leftJoin('transaction_tag', 'transactionTag', 'transactionTag.transactionId = transaction.id')
    .leftJoinAndMapMany('transaction.tags', Tag, 'tag', 'tag.id = transactionTag.tagId')
    .leftJoinAndMapOne(
      'transaction.recurringTransaction',
      RecurringTransaction,
      'recurringTransaction',
      'recurringTransaction.id = transaction.recurringTransactionId'
    )
    .leftJoinAndMapOne(
      'recurringTransaction.merchant',
      Merchant,
      'recurringTransactionMerchant',
      'recurringTransactionMerchant.id = recurringTransaction.merchantId'
    )
    .where('transaction.householdId = :householdId', { householdId })
    .andWhere('transaction.id = :id', { id })
    .getOneOrFail()

  const historyCount = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .where('transaction.householdId = :householdId', { householdId })
    .andWhere('transaction.merchantId = :merchantId', { merchantId: transaction.merchantId })
    .getCount()

  const rules = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .where('rule.householdId = :householdId', { householdId })
    .getMany()

  const matchingRules = rules.filter((rule) =>
    shouldApplyRule(
      rule,
      transaction.name,
      transaction.amount,
      transaction.account.id,
      transaction.category,
      transaction.merchant
    )
  )

  return response.send({
    errors: [],
    payload: {
      ...transaction,
      historyCount,
      matchingRules
    }
  })
}

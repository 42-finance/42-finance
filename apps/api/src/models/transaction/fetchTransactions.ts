import { Account, Category, Connection, Group, Merchant, Tag, Transaction, dataSource } from 'database'

import { filterTransactionsQuery } from './filterTransactionsQuery'
import { TransactionQueryParams } from './transactionQueryParams'

export const fetchTransactions = async (householdId: number, query: TransactionQueryParams) => {
  let transactionsQuery = dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .leftJoinAndMapOne('transaction.category', Category, 'category', 'category.id = transaction.categoryId')
    .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
    .leftJoinAndMapOne('transaction.merchant', Merchant, 'merchant', 'merchant.id = transaction.merchantId')
    .leftJoinAndMapOne('transaction.account', Account, 'account', 'account.id = transaction.accountId')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .leftJoin('transaction_tag', 'transactionTag', 'transactionTag.transactionId = transaction.id')
    .leftJoinAndMapMany('transaction.tags', Tag, 'tag', 'tag.id = transactionTag.tagId')
    .where('transaction.householdId = :householdId', { householdId })
    .andWhere('transaction.split = :split', { split: false })
    .addOrderBy('transaction.date', 'DESC')
    .addOrderBy('transaction.splitTransactionId')
    .addOrderBy('transaction.id')

  transactionsQuery = filterTransactionsQuery(transactionsQuery, query)

  return transactionsQuery.getMany()
}

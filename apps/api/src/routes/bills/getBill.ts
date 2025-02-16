import { Account, Bill, Category, Connection, Group, Transaction, User, dataSource, getExchangeRate } from 'database'
import { startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { CategoryType } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getBill = async (request: Request<{ id: number }, {}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request
  const { id } = request.params

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const bill = await dataSource
    .getRepository(Bill)
    .createQueryBuilder('bill')
    .leftJoinAndMapOne('bill.account', Account, 'account', 'account.id = bill.accountId')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('bill.householdId = :householdId', { householdId })
    .andWhere('bill.id = :id', { id })
    .getOneOrFail()

  const transactions = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .leftJoinAndMapOne('transaction.category', Category, 'category', 'category.id = transaction.categoryId')
    .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
    .where('transaction.householdId = :householdId', { householdId })
    .andWhere('transaction.accountId = :accountId', { accountId: bill.accountId })
    .andWhere('transaction.amount < 0')
    .andWhere('group.type = :groupType', { groupType: CategoryType.Transfer })
    .orderBy('transaction.date')
    .getMany()

  let convertedBalance = bill.balance

  if (convertedBalance && user.currencyCode !== bill.account.currencyCode) {
    const exchangeRate = await getExchangeRate(bill.account.currencyCode, user.currencyCode)
    convertedBalance *= exchangeRate
  }

  const billTransaction = transactions.find((t) => t.date.getTime() >= bill.issueDate.getTime())
  const today = startOfDay(new Date())
  const isPaid = billTransaction != null || bill.balance === 0
  const isOverdue = !isPaid && bill.dueDate && today.getTime() > bill.dueDate.getTime()
  const billTransactions = transactions.filter(
    (t) => t.date.getTime() >= bill.issueDate.getTime() && (!bill.dueDate || t.date.getTime() <= bill.dueDate.getTime())
  )
  const billPayments = billTransactions.map((t, index) => ({
    id: index,
    amount: Math.abs(t.amount),
    date: t.date,
    accountId: t.accountId,
    account: bill.account,
    householdId: t.householdId
  }))

  const convertedBill = {
    ...bill,
    convertedBalance,
    isPaid,
    isOverdue,
    billPayments
  }

  return response.send({
    errors: [],
    payload: convertedBill
  })
}

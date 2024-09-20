import { Account, Bill, BillPayment, Connection, User, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

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
    .where('bill.id = :id', { id })
    .getOneOrFail()

  const allBillPayments = await dataSource
    .getRepository(BillPayment)
    .createQueryBuilder('billPayment')
    .leftJoinAndMapOne('billPayment.account', Account, 'account', 'account.id = billPayment.accountId')
    .where('billPayment.householdId = :householdId', { householdId })
    .addOrderBy('billPayment.date')
    .getMany()

  let convertedBalance = bill.balance

  if (convertedBalance && user.currencyCode !== bill.account.currencyCode) {
    const exchangeRate = await getExchangeRate(bill.account.currencyCode, user.currencyCode)
    convertedBalance *= exchangeRate
  }

  const billPayment = allBillPayments.find((p) => p.date.getTime() >= bill.issueDate.getTime())
  const today = startOfDay(new Date())
  const isPaid = billPayment != null
  const isOverdue = !isPaid && bill.dueDate && today.getTime() > bill.dueDate.getTime()
  const billPayments = allBillPayments.filter(
    (p) => p.date.getTime() >= bill.issueDate.getTime() && (!bill.dueDate || p.date.getTime() <= bill.dueDate.getTime())
  )

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

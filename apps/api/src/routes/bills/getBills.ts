import { Account, Bill, BillPayment, Connection, User, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

type BillsQueryParams = {
  startDate?: string | null
  search?: string | null
  accountId?: string | null
}

export const getBills = async (
  request: Request<{}, {}, {}, BillsQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { startDate, search, accountId } = request.query

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  let billsQuery = dataSource
    .getRepository(Bill)
    .createQueryBuilder('bill')
    .leftJoinAndMapOne('bill.account', Account, 'account', 'account.id = bill.accountId')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('bill.householdId = :householdId', { householdId })
    .addOrderBy('bill.issueDate', 'DESC')

  if (startDate) {
    billsQuery = billsQuery.andWhere('bill.dueDate >= :startDate', { startDate })
  }

  if (search) {
    billsQuery = billsQuery.andWhere(`account.name ILIKE :search`, { search: `%${search}%` })
  }

  if (accountId) {
    billsQuery = billsQuery.andWhere(`account.id = :accountId`, { accountId })
  }

  const bills = await billsQuery.getMany()

  const billPayments = await dataSource
    .getRepository(BillPayment)
    .createQueryBuilder('billPayment')
    .leftJoinAndMapOne('billPayment.account', Account, 'account', 'account.id = billPayment.accountId')
    .where('billPayment.householdId = :householdId', { householdId })
    .addOrderBy('billPayment.date')
    .getMany()

  const convertedBills: Bill[] = []

  for (const bill of bills) {
    let convertedBalance = bill.balance

    if (convertedBalance && user.currencyCode !== bill.account.currencyCode) {
      const exchangeRate = await getExchangeRate(bill.account.currencyCode, user.currencyCode)
      convertedBalance *= exchangeRate
    }

    const billPayment = billPayments.find((p) => p.date.getTime() >= bill.issueDate.getTime())
    const today = startOfDay(new Date())
    const isPaid = billPayment != null || bill.balance == 0
    const isOverdue = !isPaid && bill.dueDate && today.getTime() > bill.dueDate.getTime()

    convertedBills.push({
      ...bill,
      convertedBalance,
      isPaid,
      isOverdue,
      billPayments: []
    })
  }

  return response.send({
    errors: [],
    payload: convertedBills
  })
}

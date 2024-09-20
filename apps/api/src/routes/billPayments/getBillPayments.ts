import { Account, BillPayment, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

export const getBillPayments = async (request: Request<{}, {}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request

  const billPayments = await dataSource
    .getRepository(BillPayment)
    .createQueryBuilder('billPayment')
    .leftJoinAndMapOne('billPayment.account', Account, 'account', 'account.id = billPayment.accountId')
    .where('billPayment.householdId = :householdId', { householdId })
    .addOrderBy('billPayment.date', 'DESC')
    .getMany()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedBillPayments: BillPayment[] = []

  for (const billPayment of billPayments) {
    let convertedAmount = billPayment.amount

    if (user.currencyCode !== billPayment.account.currencyCode) {
      const exchangeRate = await getExchangeRate(billPayment.account.currencyCode, user.currencyCode)
      convertedAmount *= exchangeRate
    }

    convertedBillPayments.push({
      ...billPayment,
      convertedAmount
    })
  }

  return response.send({
    errors: [],
    payload: convertedBillPayments
  })
}

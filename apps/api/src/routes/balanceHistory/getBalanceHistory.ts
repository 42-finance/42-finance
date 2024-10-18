import { Account, BalanceHistory, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

type BalanceHistoryQuery = {
  startDate?: string
  endDate?: string
  accountIds?: string
}

export const getBalanceHistory = async (
  request: Request<object, object, object, BalanceHistoryQuery>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { startDate, endDate, accountIds } = request.query

  let balanceHistoryQuery = dataSource
    .getRepository(BalanceHistory)
    .createQueryBuilder('balanceHistory')
    .leftJoinAndMapOne('balanceHistory.account', Account, 'account', 'account.id = balanceHistory.accountId')
    .where('balanceHistory.householdId = :householdId', { householdId })
    .addOrderBy('account.id')
    .addOrderBy('balanceHistory.date')

  if (startDate) {
    balanceHistoryQuery = balanceHistoryQuery.andWhere('balanceHistory.date >= :startDate', { startDate })
  }
  if (endDate) {
    balanceHistoryQuery = balanceHistoryQuery.andWhere('balanceHistory.date <= :endDate', { endDate })
  }
  if (accountIds) {
    balanceHistoryQuery = balanceHistoryQuery.andWhere('balanceHistory.accountId IN (:...accountIds)', {
      accountIds: accountIds.split(',')
    })
  }

  const balanceHistory = await balanceHistoryQuery.getMany()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedHistory: BalanceHistory[] = []

  for (const history of balanceHistory) {
    if (history.account == null) {
      continue
    }

    let convertedBalance = history.currentBalance

    if (user.currencyCode !== history.account.currencyCode) {
      const exchangeRate = await getExchangeRate(history.account.currencyCode, user.currencyCode)
      convertedBalance *= exchangeRate
    }
    convertedHistory.push({
      ...history,
      convertedBalance
    })
  }

  return response.send({
    errors: [],
    payload: convertedHistory
  })
}

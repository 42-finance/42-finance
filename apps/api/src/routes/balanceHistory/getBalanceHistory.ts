import { Account, BalanceHistory, User, dataSource, getExchangeRate } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type BalanceHistoryQuery = {
  startDate?: string
  endDate?: string
  accountIds?: string
  hideFromAccountsList?: boolean
  hideFromNetWorth?: boolean
  hideFromBudget?: boolean
}

export const getBalanceHistory = async (
  request: Request<object, object, object, BalanceHistoryQuery>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { startDate, endDate, accountIds, hideFromAccountsList, hideFromNetWorth, hideFromBudget } = request.query

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
  if (hideFromAccountsList != null) {
    balanceHistoryQuery = balanceHistoryQuery.andWhere('account.hideFromAccountsList = :hideFromAccountsList', {
      hideFromAccountsList
    })
  }
  if (hideFromNetWorth != null) {
    balanceHistoryQuery = balanceHistoryQuery.andWhere('account.hideFromNetWorth = :hideFromNetWorth', {
      hideFromNetWorth
    })
  }
  if (hideFromBudget != null) {
    balanceHistoryQuery = balanceHistoryQuery.andWhere('account.hideFromBudget = :hideFromBudget', {
      hideFromBudget
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

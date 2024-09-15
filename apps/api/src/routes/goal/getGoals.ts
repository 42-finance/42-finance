import { Account, Connection, Goal, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

export const getGoals = async (request: Request, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request

  const goals = await dataSource
    .getRepository(Goal)
    .createQueryBuilder('goal')
    .leftJoin('goal_account', 'goalAccount', 'goalAccount.goalId = goal.id')
    .leftJoinAndMapMany('goal.accounts', Account, 'account', 'account.id = goalAccount.accountId')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('goal.householdId = :householdId', { householdId })
    .addOrderBy('goal.id')
    .getMany()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedGoals: Goal[] = []

  for (const goal of goals) {
    const convertedAccounts = []

    for (const account of goal.accounts ?? []) {
      let convertedBalance = account.currentBalance
      if (user.currencyCode !== account.currencyCode) {
        const exchangeRate = await getExchangeRate(account.currencyCode, user.currencyCode)
        convertedBalance *= exchangeRate
      }
      convertedAccounts.push({
        ...account,
        convertedBalance
      })
    }

    convertedGoals.push({
      ...goal,
      accounts: convertedAccounts
    })
  }

  return response.send({
    errors: [],
    payload: convertedGoals
  })
}

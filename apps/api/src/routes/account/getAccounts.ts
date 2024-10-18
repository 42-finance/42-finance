import { Account, Connection, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

export const getAccounts = async (request: Request, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request

  const accounts = await dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('account.householdId = :householdId', { householdId })
    .addOrderBy('account.subType')
    .addOrderBy('account.name')
    .addOrderBy('account.id')
    .getMany()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedAccounts = []

  for (const account of accounts) {
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

  return response.send({
    errors: [],
    payload: convertedAccounts
  })
}

import { Account, AccountGroup, Connection, User, dataSource, getExchangeRate } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getAccountGroups = async (request: Request, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request

  const accountGroups = await dataSource
    .getRepository(AccountGroup)
    .createQueryBuilder('accountGroup')
    .leftJoinAndMapMany('accountGroup.accounts', Account, 'account', 'account.accountGroupId = accountGroup.id')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('accountGroup.householdId = :householdId', { householdId })
    .addOrderBy('accountGroup.name')
    .getMany()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  const convertedAccountGroups = []

  for (const accountGroup of accountGroups) {
    const convertedAccounts = []

    for (const account of accountGroup.accounts) {
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

    convertedAccountGroups.push({
      ...accountGroup,
      accounts: convertedAccounts
    })
  }

  return response.send({
    errors: [],
    payload: convertedAccountGroups
  })
}

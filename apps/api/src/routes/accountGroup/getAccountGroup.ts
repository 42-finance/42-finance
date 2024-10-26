import { Account, AccountGroup, Connection, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

export const getAccountGroup = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request
  const { id } = request.params

  const accountGroup = await dataSource
    .getRepository(AccountGroup)
    .createQueryBuilder('accountGroup')
    .leftJoinAndMapMany('accountGroup.accounts', Account, 'account', 'account.accountGroupId = accountGroup.id')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .where('accountGroup.householdId = :householdId', { householdId })
    .andWhere('accountGroup.id = :id', { id })
    .getOneOrFail()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

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

  return response.send({
    errors: [],
    payload: {
      ...accountGroup,
      accounts: convertedAccounts
    }
  })
}

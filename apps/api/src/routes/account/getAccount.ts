import { Account, AccountGroup, Connection, User, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getExchangeRate } from '../../utils/exchange-rate.utils'

export const getAccount = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request
  const { id } = request.params

  const account = await dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .leftJoinAndMapOne('account.accountGroup', AccountGroup, 'accountGroup', 'accountGroup.id = account.accountGroupId')
    .loadRelationCountAndMap('account.transactionCount', 'account.transactions')
    .where('account.householdId = :householdId', { householdId })
    .andWhere('account.id = :id', { id })
    .getOneOrFail()

  const user = await dataSource.getRepository(User).findOneOrFail({ where: { id: userId } })

  let convertedBalance = account.currentBalance

  if (user.currencyCode !== account.currencyCode) {
    const exchangeRate = await getExchangeRate(account.currencyCode, user.currencyCode)
    convertedBalance *= exchangeRate
  }

  return response.send({
    errors: [],
    payload: {
      ...account,
      convertedBalance
    }
  })
}

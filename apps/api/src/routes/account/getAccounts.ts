import { Account, AccountGroup, Connection, User, dataSource, getExchangeRate } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type AccountsQuery = {
  hideFromAccountsList?: boolean
  hideFromNetWorth?: boolean
  hideFromBudget?: boolean
}

export const getAccounts = async (
  request: Request<object, object, object, AccountsQuery>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId, userId } = request
  const { hideFromAccountsList, hideFromNetWorth, hideFromBudget } = request.query

  let accountsQuery = dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .leftJoinAndMapOne('account.connection', Connection, 'connection', 'connection.id = account.connectionId')
    .leftJoinAndMapOne('account.accountGroup', AccountGroup, 'accountGroup', 'accountGroup.id = account.accountGroupId')
    .where('account.householdId = :householdId', { householdId })
    .addOrderBy('account.subType')
    .addOrderBy('account.name')
    .addOrderBy('account.id')

  if (hideFromAccountsList != null) {
    accountsQuery = accountsQuery.andWhere('account.hideFromAccountsList = :hideFromAccountsList', {
      hideFromAccountsList
    })
  }
  if (hideFromNetWorth != null) {
    accountsQuery = accountsQuery.andWhere('account.hideFromNetWorth = :hideFromNetWorth', {
      hideFromNetWorth
    })
  }
  if (hideFromBudget != null) {
    accountsQuery = accountsQuery.andWhere('account.hideFromBudget = :hideFromBudget', {
      hideFromBudget
    })
  }

  const accounts = await accountsQuery.getMany()

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

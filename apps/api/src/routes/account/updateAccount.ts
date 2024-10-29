import { Account, BalanceHistory, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { AccountSubType, AccountType, CurrencyCode } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateAccountRequest = {
  name?: string
  type?: AccountType
  subType?: AccountSubType
  currentBalance?: number
  currencyCode?: CurrencyCode
  accountGroupId?: number | null
  hideFromAccountsList?: boolean
  hideFromNetWorth?: boolean
  hideFromBudget?: boolean
}

export const updateAccount = async (
  request: Request<{ id: string }, object, UpdateAccountRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const {
    name,
    type,
    subType,
    currentBalance,
    currencyCode,
    accountGroupId,
    hideFromAccountsList,
    hideFromNetWorth,
    hideFromBudget
  } = request.body

  const account = await dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .where('account.id = :id', { id })
    .andWhere('account.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(Account).update(account.id, {
    name,
    type,
    subType,
    currentBalance,
    currencyCode,
    accountGroupId,
    hideFromAccountsList,
    hideFromNetWorth,
    hideFromBudget
  })

  if (currentBalance !== account.currentBalance) {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistory)
      .values({
        date: startOfDay(new Date()),
        currentBalance,
        availableBalance: account.availableBalance,
        limit: account.limit,
        accountId: account.id,
        householdId
      })
      .orUpdate(['currentBalance', 'availableBalance', 'limit'], ['date', 'accountId'])
      .execute()
  }

  return response.json({
    errors: [],
    payload: result
  })
}

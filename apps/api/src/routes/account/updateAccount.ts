import { Account, BalanceHistory, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { AccountSubType, AccountType, CurrencyCode } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { convertAccountCurrency } from '../../utils/account.utils'

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
  convertBalanceCurrency?: boolean
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
    hideFromBudget,
    convertBalanceCurrency
  } = request.body

  const account = await dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .where('account.id = :id', { id })
    .andWhere('account.householdId = :householdId', { householdId })
    .getOneOrFail()

  return await dataSource.transaction(async (entityManager) => {
    const result = await entityManager.getRepository(Account).update(account.id, {
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

    if (currentBalance != null && currentBalance !== account.currentBalance) {
      await entityManager
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

    if (convertBalanceCurrency && currencyCode && currencyCode != account.currencyCode) {
      await convertAccountCurrency(id, householdId, account.currencyCode, currencyCode, entityManager)
    }

    return response.json({
      errors: [],
      payload: result
    })
  })
}

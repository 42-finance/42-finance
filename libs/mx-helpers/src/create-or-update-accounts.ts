import { Account, BalanceHistory, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { AccountResponse } from 'mx-platform-node'
import { CurrencyCode } from 'shared-types'

import { MxAccountSubType } from './types/mx-account-sub-type'
import { MxAccountType } from './types/mx-account-type'
import { mapAccountSubType } from './utils/map-account-sub-type'
import { mapAccountType } from './utils/map-account-type'

export const createOrUpdateAccounts = async (
  connectionId: string,
  householdId: number,
  accounts: AccountResponse[]
) => {
  const savedAccounts: Account[] = []

  for (const account of accounts) {
    const savedAccount = await dataSource.getRepository(Account).save({
      id: account.guid as string,
      name: account.name as string,
      officialName: account.name,
      type: mapAccountType(account.type as MxAccountType),
      subType: mapAccountSubType(account.subtype as MxAccountSubType, account.type as MxAccountType),
      currentBalance: account.balance as number,
      availableBalance: account.available_balance,
      limit: account.credit_limit,
      currencyCode: (account.currency_code as CurrencyCode) ?? CurrencyCode.CAD,
      householdId,
      connectionId
    })

    savedAccounts.push(savedAccount)

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistory)
      .values({
        date: startOfDay(new Date()),
        currentBalance: savedAccount.currentBalance,
        availableBalance: savedAccount.availableBalance,
        limit: savedAccount.limit,
        accountId: savedAccount.id,
        householdId
      })
      .orIgnore()
      .execute()
  }

  return savedAccounts
}

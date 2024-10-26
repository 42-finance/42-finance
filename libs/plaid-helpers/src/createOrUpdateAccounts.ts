import { Account, AccountGroup, BalanceHistory, Connection, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { mapAccountSubTypeToAccountGroupType } from 'frontend-utils'
import { AccountBase } from 'plaid'
import { CurrencyCode } from 'shared-types'

import { mapPlaidAccountSubType } from './utils/mapPlaidAccountSubType'
import { mapPlaidAccountType } from './utils/mapPlaidAccountType'

export const createOrUpdateAccounts = async (connection: Connection, accounts: AccountBase[]) => {
  const savedAccounts: Account[] = []

  const accountGroups = await dataSource.getRepository(AccountGroup).findBy({ householdId: connection.householdId })

  for (const account of accounts) {
    const type = mapPlaidAccountType(account.type)
    const subType = mapPlaidAccountSubType(account.subtype)
    const accountGroupType = mapAccountSubTypeToAccountGroupType(subType)
    const accountGroup = accountGroups.find((a) => a.type === accountGroupType)

    const savedAccount = {
      id: account.account_id,
      name: account.name,
      officialName: account.official_name,
      mask: account.mask,
      type,
      subType,
      currentBalance: account.balances?.current ?? 0,
      availableBalance: account.balances?.available,
      limit: account.balances?.limit,
      currencyCode:
        (account.balances?.iso_currency_code as CurrencyCode) ??
        (account.balances?.unofficial_currency_code as CurrencyCode) ??
        CurrencyCode.USD,
      accountGroupId: accountGroup?.id,
      connectionId: connection.id,
      householdId: connection.householdId
    } as Account

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Account)
      .values(savedAccount)
      .orUpdate(['currentBalance', 'availableBalance', 'limit'], ['id'])
      .execute()

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistory)
      .values({
        date: startOfDay(new Date()),
        currentBalance: savedAccount.currentBalance,
        availableBalance: savedAccount.availableBalance,
        limit: savedAccount.limit,
        accountId: account.account_id,
        householdId: connection.householdId
      })
      .orIgnore()
      .execute()

    savedAccounts.push(savedAccount)
  }

  return savedAccounts
}

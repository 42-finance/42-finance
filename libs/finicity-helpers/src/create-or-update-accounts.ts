import { Account, BalanceHistory, dataSource } from 'database'
import { startOfDay } from 'date-fns'

import { FinicityAccount } from './types/FinicityAccount'
import { mapAccountSubType } from './utils/map-account-sub-type'
import { mapAccountType } from './utils/map-account-type'

export const createOrUpdateAccounts = async (householdId: number, accounts: FinicityAccount[]) => {
  const savedAccounts: Account[] = []

  for (const account of accounts) {
    const savedAccount = await dataSource.getRepository(Account).save({
      id: account.id,
      name: account.name,
      officialName: account.name,
      mask: account.realAccountNumberLast4,
      type: mapAccountType(account.type),
      subType: mapAccountSubType(account.type),
      currentBalance: account.balance,
      currencyCode: account.currency,
      householdId
    })

    savedAccounts.push(savedAccount)

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(BalanceHistory)
      .values({
        date: startOfDay(new Date()),
        currentBalance: account.balance,
        accountId: account.id,
        householdId
      })
      .orIgnore()
      .execute()
  }

  return savedAccounts
}

import { Account, dataSource } from 'database'

export const updateFinicityCursor = async (accountId: string, lastUpdate: Date | null) =>
  await dataSource.getRepository(Account).update(accountId, { lastTransactionsUpdate: lastUpdate })

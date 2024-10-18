import { Account, dataSource } from 'database'

export const updateCursor = async (accountId: string, lastUpdate: Date | null) =>
  await dataSource.getRepository(Account).update(accountId, { lastTransactionsUpdate: lastUpdate })

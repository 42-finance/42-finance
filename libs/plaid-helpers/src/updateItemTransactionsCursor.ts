import { Connection, dataSource } from 'database'

export const updateItemTransactionsCursor = async (connectionId: string, transactionsCursor: string | null) =>
  await dataSource.getRepository(Connection).update(connectionId, { transactionsCursor })

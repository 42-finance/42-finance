import { Connection, dataSource } from 'database'
import { sendNewTransactionNotifications } from 'notifications'

import { createOrUpdateAccounts } from './createOrUpdateAccounts'
import { createOrUpdateTransactions } from './createOrUpdateTransactions'
import { plaidClient } from './createPlaidClient'
import { deleteTransactions } from './deleteTransactions'
import { fetchTransactionUpdates } from './fetchTransactionUpdates'
import { updateItemTransactionsCursor } from './updateItemTransactionsCursor'

export const updateTransactions = async (connectionId: string) => {
  const connection = await dataSource.getRepository(Connection).findOneOrFail({ where: { id: connectionId } })

  const { added, modified, removed, cursor, accessToken } = await fetchTransactionUpdates(connection)

  const {
    data: { accounts }
  } = await plaidClient.accountsGet({ access_token: accessToken as string })

  const savedAccounts = await createOrUpdateAccounts(connection, accounts)
  const newTransactions = await createOrUpdateTransactions(added, modified, connection.householdId)
  await deleteTransactions(removed)
  await updateItemTransactionsCursor(connection.id, cursor)
  await sendNewTransactionNotifications(savedAccounts, newTransactions)

  return {
    addedCount: added.length,
    modifiedCount: modified.length,
    removedCount: removed.length
  }
}

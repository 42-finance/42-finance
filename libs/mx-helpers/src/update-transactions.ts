import { Boom } from '@hapi/boom'
import { Connection, Household, Transaction, dataSource } from 'database'
import { startOfMonth, subMonths } from 'date-fns'
import { sendNewTransactionNotifications } from 'notifications'

import { createOrUpdateAccounts } from './create-or-update-accounts'
import { createOrUpdateTransactions } from './create-or-update-transactions'
import { fetchTransactionUpdates } from './fetch-transaction-updates'
import { getAccounts } from './get-accounts'
import { updateCursor } from './update-cursor'

export const updateTransactions = async (connectionId: string) => {
  const connection = await dataSource.getRepository(Connection).findOneOrFail({ where: { id: connectionId } })
  const household = await dataSource.getRepository(Household).findOneOrFail({ where: { id: connection.householdId } })
  if (!household.mxUserId) {
    throw new Boom('Household is not linked to a MX user', { statusCode: 409 })
  }

  const accounts = await getAccounts(household.mxUserId)
  const savedAccounts = await createOrUpdateAccounts(connection.id, household.id, accounts)

  const newTransactions: Transaction[] = []

  for (const account of savedAccounts) {
    const startDate = account.lastTransactionsUpdate ?? startOfMonth(subMonths(new Date(), 6))
    const endDate = new Date()
    const transactions = await fetchTransactionUpdates(household.mxUserId, account.id, startDate, endDate)
    const savedTransactions = await createOrUpdateTransactions(household.id, transactions, account)
    if (savedTransactions.length) {
      const lastTransaction = savedTransactions[0]
      await updateCursor(account.id, lastTransaction.date)
      newTransactions.push(...savedTransactions)
    }
  }

  await sendNewTransactionNotifications(savedAccounts, newTransactions)

  return {
    addedCount: newTransactions.length,
    modifiedCount: 0,
    removedCount: 0
  }
}

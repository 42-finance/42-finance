import { Transaction } from 'database'
import { startOfMonth, subMonths } from 'date-fns'
import { sendNewTransactionNotifications } from 'notifications'

import { createOrUpdateAccounts } from './create-or-update-accounts'
import { createOrUpdateTransactions } from './create-or-update-transactions'
import { finicityLogin } from './finicity-login'
import { getFinicityTransactions } from './get-finicity-transactions'
import { refreshFinicityAccounts } from './refresh-finicity-accounts'
import { updateFinicityCursor } from './update-finicity-cursor'

export const updateFinicityTransactions = async (householdId: number, customerId: string) => {
  const token = await finicityLogin()
  const { accounts } = await refreshFinicityAccounts(customerId, token)
  const savedAccounts = await createOrUpdateAccounts(householdId, accounts)

  const newTransactions: Transaction[] = []

  for (const account of savedAccounts) {
    const startDate = account.lastTransactionsUpdate ?? startOfMonth(subMonths(new Date(), 6))
    const endDate = new Date()
    const transactions = await getFinicityTransactions(customerId, account.id, token, startDate, endDate)
    const savedTransactions = await createOrUpdateTransactions(householdId, transactions, account)
    if (savedTransactions.length) {
      const lastTransaction = savedTransactions[0]
      await updateFinicityCursor(account.id, lastTransaction.date)
      newTransactions.push(...savedTransactions)
    }
  }

  await sendNewTransactionNotifications(savedAccounts, newTransactions)
}

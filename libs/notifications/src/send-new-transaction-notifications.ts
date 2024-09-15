import { Account, Transaction } from 'database'
import { ExpoPushMessage } from 'expo-server-sdk'

import { createNewTransactionMessages } from './create-new-transaction-messages'
import { sendPushNotifications } from './send-push-notifications'

export const sendNewTransactionNotifications = async (accounts: Account[], transactions: Transaction[]) => {
  const messages: ExpoPushMessage[] = []

  for (const account of accounts) {
    const accountTransactions = transactions.filter((t) => t.accountId === account.id)

    if (accountTransactions.length > 0) {
      const accountMessages = await createNewTransactionMessages(account, accountTransactions.length)
      messages.push(...accountMessages)
    }
  }

  await sendPushNotifications(messages)
}

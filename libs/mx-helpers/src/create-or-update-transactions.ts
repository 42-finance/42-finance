import { Account, Rule, Transaction, dataSource } from 'database'
import { TransactionResponse } from 'mx-platform-node'

import { saveTransaction } from './save-transaction'

export const createOrUpdateTransactions = async (
  householdId: number,
  transactions: TransactionResponse[],
  account: Account
) => {
  const rules = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .where('rule.householdId = :householdId', { householdId })
    .getMany()

  let savedTransactions: Transaction[] = []

  for (const transaction of transactions) {
    if (transaction.status === 'POSTED') {
      const savedTransaction = await saveTransaction(transaction, householdId, rules, account.currencyCode)
      savedTransactions.push(savedTransaction)
    }
  }

  savedTransactions = savedTransactions.sort((t1, t2) => t2.date.getTime() - t1.date.getTime())

  return savedTransactions
}

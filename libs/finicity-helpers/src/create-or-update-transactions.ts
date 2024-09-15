import { Account, Rule, Transaction, dataSource } from 'database'

import { saveTransaction } from './save-transaction'
import { FinicityTransaction } from './types/FinicityTransaction'

export const createOrUpdateTransactions = async (
  householdId: number,
  transactions: FinicityTransaction[],
  account: Account
) => {
  const rules = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .where('rule.householdId = :householdId', { householdId })
    .getMany()

  let savedTransactions: Transaction[] = []

  for (const transaction of transactions) {
    const savedTransaction = await saveTransaction(transaction, householdId, rules, account.currencyCode)
    savedTransactions.push(savedTransaction)
  }

  savedTransactions = savedTransactions.sort((t1, t2) => t2.date.getTime() - t1.date.getTime())

  return savedTransactions
}

import { Rule, Transaction, dataSource } from 'database'
import { Transaction as PlaidTransaction } from 'plaid'

import { saveTransaction } from './saveTransaction'

export const createOrUpdateTransactions = async (
  addedTransactions: PlaidTransaction[],
  modifiedTransactions: PlaidTransaction[],
  householdId: number
) => {
  const rules = await dataSource
    .getRepository(Rule)
    .createQueryBuilder('rule')
    .where('rule.householdId = :householdId', { householdId })
    .getMany()

  const newTransactions: Transaction[] = []

  for (const transaction of addedTransactions) {
    const newTransaction = await saveTransaction(transaction, householdId, rules)
    if (newTransaction) {
      newTransactions.push(newTransaction)
    }
  }

  for (const transaction of modifiedTransactions) {
    await saveTransaction(transaction, householdId, rules)
  }

  return newTransactions
}

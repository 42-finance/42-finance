import { Transaction, dataSource } from 'database'
import { RemovedTransaction } from 'plaid'

export const deleteTransactions = async (transactions: RemovedTransaction[]) => {
  const ids = transactions.filter((t) => t.transaction_id).map((t) => t.transaction_id!)
  if (ids.length > 0) {
    await dataSource.getRepository(Transaction).delete(ids)
  }
}

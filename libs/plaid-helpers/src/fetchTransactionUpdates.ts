import { Connection } from 'database'
import { RemovedTransaction, Transaction } from 'plaid'

import { plaidClient } from './createPlaidClient'

export const fetchTransactionUpdates = async (connection: Connection) => {
  const { accessToken, transactionsCursor: lastCursor } = connection

  let cursor = lastCursor

  let added: Transaction[] = []
  let modified: Transaction[] = []
  let removed: RemovedTransaction[] = []
  let hasMore = true

  const batchSize = 100
  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken as string,
        cursor: cursor ?? undefined,
        count: batchSize
      })
      const data = response.data
      added = added.concat(data.added)
      modified = modified.concat(data.modified)
      removed = removed.concat(data.removed)
      hasMore = data.has_more
      cursor = data.next_cursor
    }
  } catch (error: any) {
    console.error(`Error fetching transactions: ${error.message}`)
    cursor = lastCursor
  }

  return {
    added,
    modified,
    removed,
    cursor,
    accessToken
  }
}

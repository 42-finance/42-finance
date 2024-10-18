import { format } from 'date-fns'
import { TransactionResponse } from 'mx-platform-node'

import { mxClient } from './mx-client'

export const fetchTransactionUpdates = async (mxUserId: string, accountId: string, startDate: Date, endDate: Date) => {
  let transactions: TransactionResponse[] = []
  let hasMore = true
  const batchSize = 100
  let page = 1

  while (hasMore) {
    const response = await mxClient.listTransactionsByAccount(
      accountId,
      mxUserId,
      format(startDate, 'yyyy-MM-dd'),
      page,
      batchSize,
      format(endDate, 'yyyy-MM-dd')
    )
    transactions = transactions.concat(response.data.transactions ?? [])
    hasMore = response.data.pagination?.total_pages != null && page < response.data.pagination.total_pages
    page++
  }

  return transactions
}

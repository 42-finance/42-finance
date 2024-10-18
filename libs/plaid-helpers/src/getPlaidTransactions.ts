import { format } from 'date-fns'
import { Transaction as PlaidTransaction } from 'plaid'

import { plaidClient } from './createPlaidClient'

export const getPlaidTransactions = async (accessToken: string, startDate: Date, endDate: Date) => {
  const plaidTransactions: PlaidTransaction[] = []
  let needsTokenRefresh = false
  let offset = 0

  try {
    while (true) {
      const transactionsRes = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        options: { offset }
      })
      plaidTransactions.push(...transactionsRes.data.transactions)
      offset += transactionsRes.data.transactions.length
      if (plaidTransactions.length >= transactionsRes.data.total_transactions) {
        break
      }
    }
  } catch {
    needsTokenRefresh = true
  }

  return {
    transactions: plaidTransactions,
    needsTokenRefresh
  }
}

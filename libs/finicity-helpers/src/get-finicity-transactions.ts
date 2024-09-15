import { finicityRequest } from './finicity-request'
import { FinicityTransaction } from './types/FinicityTransaction'

export const getFinicityTransactions = async (
  customerId: string,
  accountId: string,
  token: string,
  startDate: Date,
  endDate: Date
) => {
  let transactions: FinicityTransaction[] = []
  let hasMore = true
  let page = 1

  const startDateUnix = Math.floor(startDate.getTime() / 1000)
  const endDateUnix = Math.floor(endDate.getTime() / 1000)

  while (hasMore) {
    const response = await finicityRequest(
      `/aggregation/v4/customers/${customerId}/accounts/${accountId}/transactions?fromDate=${startDateUnix}&toDate=${endDateUnix}&includePending=false&sort=desc&limit=100&start=${page}`,
      'GET',
      null,
      token
    )
    transactions = transactions.concat(response.transactions ?? [])
    hasMore = response.moreAvailable === 'true'
    page += response.displaying
  }

  return transactions
}

import { finicityRequest } from './finicity-request'
import { FinicityAccount } from './types/FinicityAccount'

export const refreshFinicityAccounts = async (customerId: string, token: string) =>
  finicityRequest(`/aggregation/v1/customers/${customerId}/accounts`, 'POST', {}, token) as Promise<{
    accounts: FinicityAccount[]
  }>

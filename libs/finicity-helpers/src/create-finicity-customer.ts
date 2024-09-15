import { finicityRequest } from './finicity-request'

export const createFinicityCustomer = async (householdId: number, token: string) =>
  finicityRequest('/aggregation/v2/customers/testing', 'POST', { username: `household-${householdId}` }, token)

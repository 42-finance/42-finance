import { mxClient } from './mx-client'

export const getAccounts = async (mxUserId: string) => {
  const accountsResponse = await mxClient.listUserAccounts(mxUserId)
  return accountsResponse.data.accounts ?? []
}

import { AccountBase } from 'plaid'

import { createPlaidClient } from './createPlaidClient'

export const getPlaidAccounts = async (accessToken: string) => {
  const client = createPlaidClient()
  let accounts: AccountBase[] = []
  let needsTokenRefresh = false

  try {
    const accountsRes = await client.accountsGet({
      access_token: accessToken
    })
    accounts = accountsRes.data.accounts
  } catch {
    needsTokenRefresh = true
  }

  return {
    accounts,
    needsTokenRefresh
  }
}

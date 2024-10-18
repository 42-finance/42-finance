import { getOrCreateMerchant } from 'database'
import { TransactionResponse } from 'mx-platform-node'

import { mxClient } from '../mx-client'

export const getMerchant = async (transaction: TransactionResponse, householdId: number) => {
  if (transaction.merchant_guid) {
    const merchantResponse = await mxClient.readMerchant(transaction.merchant_guid)
    if (merchantResponse.data.merchant) {
      return await getOrCreateMerchant(
        merchantResponse.data.merchant.name as string,
        merchantResponse.data.merchant.name as string,
        merchantResponse.data.merchant.logo_url as string,
        householdId
      )
    }
  }

  return await getOrCreateMerchant(
    transaction.description as string,
    transaction.description as string,
    null,
    householdId
  )
}

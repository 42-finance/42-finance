import { getOrCreateMerchant } from 'database'

import { FinicityTransaction } from '../types/FinicityTransaction'

export const getMerchant = async (transaction: FinicityTransaction, householdId: number) => {
  if (transaction.categorization) {
    return await getOrCreateMerchant(
      transaction.categorization.normalizedPayeeName,
      transaction.categorization.bestRepresentation,
      null,
      householdId
    )
  }

  return await getOrCreateMerchant(transaction.description, transaction.description, null, householdId)
}

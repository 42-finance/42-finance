import { getOrCreateMerchant } from 'database'
import { Transaction as PlaidTransaction } from 'plaid'

export const getMerchant = async (transaction: PlaidTransaction, householdId: number) => {
  if (transaction.counterparties && transaction.counterparties.length > 0) {
    if (transaction.counterparties[0].entity_id) {
      return await getOrCreateMerchant(
        transaction.counterparties[0].name,
        transaction.counterparties[0].entity_id,
        transaction.counterparties[0].logo_url,
        householdId
      )
    } else if (transaction.counterparties[0].name) {
      return await getOrCreateMerchant(
        transaction.counterparties[0].name,
        transaction.counterparties[0].name,
        transaction.counterparties[0].logo_url,
        householdId
      )
    }
  }

  return await getOrCreateMerchant(transaction.name, transaction.name, null, householdId)
}

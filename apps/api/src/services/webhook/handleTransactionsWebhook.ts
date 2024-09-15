import { updateTransactions } from 'plaid-helpers'

export const handleTransactionsWebhook = async (requestBody: any) => {
  const { webhook_code: webhookCode, item_id: plaidItemId } = requestBody

  if (webhookCode === 'SYNC_UPDATES_AVAILABLE') {
    await updateTransactions(plaidItemId)
  }
}

import { updateLiabilities } from 'plaid-helpers'

export const handleLiabilitiesWebhook = async (requestBody: any) => {
  const { webhook_code: webhookCode, item_id: plaidItemId } = requestBody

  if (webhookCode === 'DEFAULT_UPDATE') {
    await updateLiabilities(plaidItemId)
  }
}

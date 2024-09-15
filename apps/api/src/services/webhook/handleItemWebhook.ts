import { setConnectionNeedsRefresh } from 'plaid-helpers'

export const handleItemWebhook = async (requestBody: any) => {
  const { webhook_code: webhookCode, item_id: plaidItemId, error } = requestBody

  if (webhookCode === 'ERROR' && error.error_code === 'ITEM_LOGIN_REQUIRED') {
    await setConnectionNeedsRefresh(plaidItemId)
  } else if (webhookCode === 'PENDING_EXPIRATION') {
    await setConnectionNeedsRefresh(plaidItemId)
  }
}

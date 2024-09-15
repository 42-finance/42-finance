export const unhandledWebhook = async (requestBody: any) => {
  const { webhook_type: webhookType, webhook_code: webhookCode, item_id: plaidItemId } = requestBody
  console.log(
    `UNHANDLED ${webhookType} WEBHOOK: ${webhookCode}: Plaid item id ${plaidItemId}: unhandled webhook type received.`
  )
}

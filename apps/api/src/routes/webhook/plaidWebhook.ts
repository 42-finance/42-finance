import { Request, Response } from 'express'

import { handleItemWebhook } from '../../services/webhook/handleItemWebhook'
import { handleLiabilitiesWebhook } from '../../services/webhook/handleLiabilitiesWebhook'
import { handleTransactionsWebhook } from '../../services/webhook/handleTransactionsWebhook'
import { unhandledWebhook } from '../../services/webhook/unhandledWebhook'

export const plaidWebhook = async (
  request: Request<object, object, { webhook_type: string }>,
  response: Response<{ status: string }>
) => {
  const { webhook_type: webhookType } = request.body
  const type = webhookType.toLowerCase()

  let webhookHandler

  switch (type) {
    case 'transactions':
      webhookHandler = handleTransactionsWebhook
      break
    case 'item':
      webhookHandler = handleItemWebhook
      break
    case 'liabilities':
      webhookHandler = handleLiabilitiesWebhook
      break
    default:
      webhookHandler = unhandledWebhook
  }

  response.json({ status: 'ok' })

  await webhookHandler(request.body)
}

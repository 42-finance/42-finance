import { Request, Response } from 'express'

type WebhookEvent = {
  id: string
  type: string
}

type QuilttWebhookRequest = {
  eventTypes: string[]
  events: WebhookEvent[]
}

export const quilttWebhook = async (
  request: Request<object, object, QuilttWebhookRequest>,
  response: Response<{ status: string }>
) => {
  console.log(request.body)

  const { events } = request.body

  response.json({ status: 'ok' })

  for (const event of events) {
    const [rootType, eventType] = event.type.split('.')

    if (rootType === 'connection') {
      if (eventType === 'created') {
        console.log('CREATED')
      } else if (eventType === 'synced') {
        console.log('SYNCED')
      }
    }
  }
}

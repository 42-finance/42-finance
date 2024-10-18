import { Request, Response } from 'express'

type MxWebhookRequest = {
  action: string
  completed_at: number
  completed_on: string
  is_background: true
  job_guid: string
  member_guid: string
  transactions_created_count: number
  transactions_updated_count: number
  type: string
  user_guid: string
  user_id: string
}

export const mxWebhook = async (
  request: Request<object, object, MxWebhookRequest>,
  response: Response<{ status: string }>
) => {
  console.log(request.body)
  response.send()
}

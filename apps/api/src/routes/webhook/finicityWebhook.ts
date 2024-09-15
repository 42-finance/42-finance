import { Request, Response } from 'express'

type FinicityWebhookRequest = {
  customerId: string
  eventType: string
  eventId: string
  payload: {
    accounts: {
      id: string
      number: string
      realAccountNumberLast4: string
      accountNumberDisplay: string
      name: string
      balance: number
      type: string
      status: string
      customerId: string
      institutionId: string
      balanceDate: number
      createdDate: number
      lastUpdatedDate: number
      currency: string
      institutionLoginId: number
      displayPosition: number
      financialinstitutionAccountStatus: string
      accountNickname: string
      marketSegment: string
    }[]
    institutionId: string
    oauth: boolean
  }
}

export const finicityWebhook = async (
  request: Request<object, object, FinicityWebhookRequest>,
  response: Response<{ status: string }>
) => {
  console.log(request.body)
  response.send()
}

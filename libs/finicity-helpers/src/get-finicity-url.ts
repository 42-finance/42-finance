import { finicityRequest } from './finicity-request'

export const getFinicityUrl = async (customerId: string, token: string) => {
  const { link } = await finicityRequest(
    '/connect/v2/generate',
    'POST',
    {
      partnerId: process.env.FINICITY_PARTNER_ID,
      customerId,
      isWebView: true,
      redirectUri: 'https://google.ca',
      webhook: `${process.env.API_URL}/webhook/finicity`,
      webhookContentType: 'application/json'
    },
    token
  )
  return link
}

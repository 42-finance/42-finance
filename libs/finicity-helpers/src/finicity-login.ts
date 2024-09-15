import { finicityRequest } from './finicity-request'

export const finicityLogin = async () => {
  const { token } = await finicityRequest('/aggregation/v2/partners/authentication', 'POST', {
    partnerId: process.env.FINICITY_PARTNER_ID,
    partnerSecret: process.env.FINICITY_SECRET
  })
  return token as string
}

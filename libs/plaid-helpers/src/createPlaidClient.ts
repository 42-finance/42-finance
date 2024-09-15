import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const config = {
  clientId: process.env.PLAID_CLIENTID,
  secret: process.env.PLAID_SECRET,
  mode: process.env.PLAID_MODE
}

export const createPlaidClient = () => {
  let environment: string
  switch (config.mode) {
    case 'production':
      environment = PlaidEnvironments.production
      break
    case 'development':
      environment = PlaidEnvironments.development
      break
    default:
      environment = PlaidEnvironments.sandbox
      break
  }
  const configuration = new Configuration({
    basePath: environment,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': config.clientId,
        'PLAID-SECRET': config.secret
      }
    }
  })
  return new PlaidApi(configuration)
}

export const plaidClient = createPlaidClient()

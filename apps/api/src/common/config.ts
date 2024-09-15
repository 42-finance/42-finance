import dotenv from 'dotenv'

dotenv.config()

export const config = {
  auth: {
    tokenSecret: process.env.TOKEN_SECRET as string
  },
  express: {
    apiUrl: process.env.API_URL as string,
    port: process.env.PORT as string
  },
  frontend: {
    appUrl: process.env.APP_URL as string
  },
  plaid: {
    clientId: process.env.PLAID_CLIENTID as string,
    secret: process.env.PLAID_SECRET as string,
    mode: process.env.PLAID_MODE as string
  },
  ethplorer: {
    apiUrl: process.env.ETHPLORER_API_URL as string,
    apiKey: process.env.ETHPLORER_API_KEY as string
  },
  exchangeRate: {
    apiUrl: process.env.EXCHANGE_RATE_API_URL as string,
    apiKey: process.env.EXCHANGE_RATE_API_KEY as string
  },
  covalent: {
    apiKey: process.env.COVALENT_API_KEY as string
  },
  quiltt: {
    secret: process.env.QUILTT_SECRET as string
  },
  stripe: {
    secret: process.env.STRIPE_SECRET as string
  },
  revenueCat: {
    secret: process.env.REVENUE_CAT_API_KEY as string
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    region: process.env.S3_REGION as string,
    attachmentsBucket: process.env.S3_ATTACHMENTS_BUCKET as string
  }
}

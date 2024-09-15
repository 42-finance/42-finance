import { Configuration, MxPlatformApi } from 'mx-platform-node'

const configuration = new Configuration({
  username: process.env.MX_CLIENT_ID,
  password: process.env.MX_API_KEY,
  basePath: process.env.MX_ENVIRONMENT === 'production' ? 'https://api.mx.com' : 'https://int-api.mx.com',
  baseOptions: {
    headers: {
      Accept: 'application/vnd.mx.api.v1+json'
    }
  }
})

export const mxClient = new MxPlatformApi(configuration)

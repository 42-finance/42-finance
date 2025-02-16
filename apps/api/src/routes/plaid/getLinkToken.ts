import { Boom } from '@hapi/boom'
import { Connection, dataSource } from 'database'
import { Request, Response } from 'express'
import { CountryCode, Products } from 'plaid'
import { plaidClient } from 'plaid-helpers'
import semver from 'semver'

import { config } from '../../common/config'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getStripeSubscription } from '../../utils/stripe.utils'

type LinkTokenQuery = {
  connectionId?: string
  platform?: string
  product?: Products
}

export const getLinkToken = async (
  request: Request<object, object, object, LinkTokenQuery>,
  response: Response<HTTPResponseBody>
) => {
  const { appVersion } = request
  if (appVersion == null || semver.lt(appVersion, '1.0.5')) {
    throw new Boom('Update to the latest version of the app to add a new account', { statusCode: 403 })
  }

  const { householdId } = request
  const { connectionId, platform, product } = request.query

  const { subscriptionType, activeConnections } = await getStripeSubscription(householdId)

  if (connectionId == null && subscriptionType == null && activeConnections > 0) {
    return response.send({
      errors: [],
      payload: {
        linkToken: null,
        connectionLimitReached: true
      }
    })
  }

  let accessToken: string | undefined = undefined
  let products: Products[]
  let additionalConsentedProducts: Products[] = []

  if (product === Products.Investments) {
    products = [Products.Investments]
    additionalConsentedProducts = [Products.Transactions, Products.Liabilities]
  } else {
    products = [Products.Transactions]
    additionalConsentedProducts = [Products.Investments, Products.Liabilities]
  }

  if (connectionId) {
    const connection = await dataSource.getRepository(Connection).findOne({ where: { id: connectionId } })
    if (connection?.accessToken) {
      accessToken = connection.accessToken
      products = []
      additionalConsentedProducts = []
      const itemRes = await plaidClient.itemGet({ access_token: connection.accessToken })
      const item = itemRes.data.item
      if (item.consented_products && !item.consented_products.includes(Products.Liabilities)) {
        additionalConsentedProducts.push(Products.Liabilities)
      }
      if (item.consented_products && !item.consented_products.includes(Products.Investments)) {
        additionalConsentedProducts.push(Products.Investments)
      }
    }
  }

  const redirect =
    platform === 'android'
      ? {
          android_package_name: 'com.fortytwofinance.app'
        }
      : platform === 'ios'
        ? {
            redirect_uri: 'https://42f.io/plaid/redirect/oauth.html'
          }
        : {
            redirect_uri: `${config.frontend.appUrl}/oauth-link`
          }

  const tokenRes = await plaidClient.linkTokenCreate({
    client_name: '42 Finance',
    country_codes: [CountryCode.Ca, CountryCode.Us],
    language: 'en',
    user: {
      client_user_id: String(householdId)
    },
    products,
    additional_consented_products: additionalConsentedProducts,
    access_token: accessToken,
    webhook: `${config.express.apiUrl}/webhook/plaid`,
    transactions: {
      days_requested: 730
    },
    ...redirect
  })

  return response.send({
    errors: [],
    payload: {
      linkToken: tokenRes.data.link_token
    }
  })
}

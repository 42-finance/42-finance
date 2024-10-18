import { Router } from 'express'

import { finicityWebhook } from './finicityWebhook'
import { mxWebhook } from './mxWebhook'
import { plaidWebhook } from './plaidWebhook'
import { quilttWebhook } from './quilttWebhook'
import { stripeWebhook } from './stripeWebhook'

const webhookRouter = Router()
webhookRouter.post('/plaid', plaidWebhook)
webhookRouter.post('/finicity', finicityWebhook)
webhookRouter.post('/mx', mxWebhook)
webhookRouter.post('/quiltt', quilttWebhook)
webhookRouter.post('/stripe', stripeWebhook)

export { webhookRouter }

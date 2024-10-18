import { Router } from 'express'

import { createCheckout } from './createCheckout'
import { createPortal } from './createPortal'
import { getSubscription } from './getSubscription'
import { updateSubscription } from './updateSubscription'

const stripeRouter = Router()
stripeRouter.post('/checkout', createCheckout)
stripeRouter.post('/portal', createPortal)
stripeRouter.get('/subscription', getSubscription)
stripeRouter.patch('/subscription', updateSubscription)

export { stripeRouter }

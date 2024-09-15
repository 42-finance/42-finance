import { Router } from 'express'

import { createAccessToken } from './createAccessToken'
import { getLinkToken } from './getLinkToken'

const plaidRouter = Router()
plaidRouter.get('/linkToken', getLinkToken)
plaidRouter.post('/accessToken', createAccessToken)

export { plaidRouter }

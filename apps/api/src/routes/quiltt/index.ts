import { Router } from 'express'

import { getSessionToken } from './getSessionToken'

const quilttRouter = Router()
quilttRouter.get('/token', getSessionToken)

export { quilttRouter }

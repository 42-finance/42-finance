import { Router } from 'express'

import { confirmEmail } from './confirmEmail'

const confirmEmailRouter = Router()
confirmEmailRouter.post('/', confirmEmail)

export { confirmEmailRouter }

import { Router } from 'express'

import { forgotPassword } from './forgotPassword'

const forgotPasswordRouter = Router()
forgotPasswordRouter.post('/', forgotPassword)

export { forgotPasswordRouter }

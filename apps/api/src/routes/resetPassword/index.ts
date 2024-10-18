import { Router } from 'express'

import { resetPassword } from './resetPassword'

const resetPasswordRouter = Router()
resetPasswordRouter.patch('/', resetPassword)

export { resetPasswordRouter }

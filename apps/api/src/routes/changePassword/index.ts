import { Router } from 'express'

import { changePassword } from './changePassword'

const changePasswordRouter = Router()
changePasswordRouter.patch('/', changePassword)

export { changePasswordRouter }

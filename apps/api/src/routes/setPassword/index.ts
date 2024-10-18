import { Router } from 'express'

import { setPassword } from './setPassword'

const setPasswordRouter = Router()
setPasswordRouter.patch('/', setPassword)

export { setPasswordRouter }

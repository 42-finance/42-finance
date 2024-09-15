import { Router } from 'express'

import { login } from './login'
import { loginWithApple } from './loginWithApple'

const loginRouter = Router()
loginRouter.post('/apple', loginWithApple)
loginRouter.post('/', login)

export { loginRouter }

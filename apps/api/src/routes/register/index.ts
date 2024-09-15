import { Router } from 'express'
import { register } from './register'

const registerRouter = Router()
registerRouter.post('/', register)

export { registerRouter }

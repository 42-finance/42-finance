import { Router } from 'express'

import deleteUser from './deleteUser'
import getUser from './getUser'
import updateUser from './updateUser'

const userRouter = Router()
userRouter.get('/', getUser)
userRouter.patch('/', updateUser)
userRouter.delete('/', deleteUser)

export { userRouter }

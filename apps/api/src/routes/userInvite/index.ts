import { Router } from 'express'

import { createUserInvite } from './createUserInvite'
import { deleteUserInvite } from './deleteUserInvite'

const userInviteRouter = Router()
userInviteRouter.delete('/', deleteUserInvite)
userInviteRouter.post('/', createUserInvite)

export { userInviteRouter }

import { Router } from 'express'

import { acceptInvitation } from './acceptInvitation'

const acceptInvitationRouter = Router()
acceptInvitationRouter.post('/', acceptInvitation)

export { acceptInvitationRouter }

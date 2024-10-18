import { Router } from 'express'

import { createNotificationToken } from './createNotificationToken'
import { deleteNotificationToken } from './deleteNotificationToken'

const notificationTokenRouter = Router()
notificationTokenRouter.post('/', createNotificationToken)
notificationTokenRouter.delete('/:token', deleteNotificationToken)
export { notificationTokenRouter }

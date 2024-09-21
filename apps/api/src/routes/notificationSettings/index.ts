import express from 'express'

import { createNotificationSetting } from './createNotificationSetting'
import { deleteNotificationSetting } from './deleteNotificationSetting'
import { getNotificationSettings } from './getNotificationSettings'
import { updateNotificationSetting } from './updateNotificationSetting'

const notificationSettingsRouter = express.Router()
notificationSettingsRouter.get('/', getNotificationSettings)
notificationSettingsRouter.post('/:type', createNotificationSetting)
notificationSettingsRouter.delete('/:type', deleteNotificationSetting)
notificationSettingsRouter.patch('/:type', updateNotificationSetting)

export { notificationSettingsRouter }

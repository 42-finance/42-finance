import express from 'express'

import { getNotificationSettings } from './getNotificationSettings'
import { updateNotificationSetting } from './updateNotificationSetting'

const notificationSettingsRouter = express.Router()
notificationSettingsRouter.get('/', getNotificationSettings)
notificationSettingsRouter.patch('/:type', updateNotificationSetting)

export { notificationSettingsRouter }

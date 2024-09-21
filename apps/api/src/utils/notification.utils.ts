import { NotificationSetting, dataSource } from 'database'
import { NotificationType } from 'shared-types'
import { EntityManager } from 'typeorm'

export const createDefaultNotifications = async (userId: number, entityManager: EntityManager = dataSource.manager) => {
  const notificationTypes = Object.values(NotificationType)

  for (const notificationType of notificationTypes) {
    await entityManager.getRepository(NotificationSetting).save({
      type: notificationType,
      userId,
      sendPushNotification: true,
      sendEmail: true,
      minimumAmount:
        notificationType === NotificationType.NewExpense || notificationType === NotificationType.NewDeposit
          ? 500
          : null
    })
  }
}

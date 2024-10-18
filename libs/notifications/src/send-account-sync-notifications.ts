import { Connection, HouseholdUser, NotificationSetting, NotificationToken, User, dataSource } from 'database'
import { ExpoPushMessage } from 'expo-server-sdk'
import { NotificationType } from 'shared-types'

import { sendPushNotifications } from './send-push-notifications'

export const sendAccountSyncNotification = async (connectionId: string) => {
  const connection = await dataSource
    .getRepository(Connection)
    .createQueryBuilder('connection')
    .where('connection.id = :connectionId', { connectionId })
    .getOneOrFail()

  const users = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndMapMany(
      'user.notificationTokens',
      NotificationToken,
      'notificationToken',
      'notificationToken.userId = user.id'
    )
    .leftJoinAndMapMany(
      'user.notificationSettings',
      NotificationSetting,
      'notificationSetting',
      'notificationSetting.userId = user.id'
    )
    .leftJoin(HouseholdUser, 'householdUser', 'householdUser.userId = user.id')
    .where('householdUser.householdId = :householdId', { householdId: connection.householdId })
    .getMany()

  const pushMessages: ExpoPushMessage[] = []

  for (const user of users) {
    const notificationSetting = user.notificationSettings.find((n) => n.type === NotificationType.AccountOutOfSync)
    if (notificationSetting?.sendPushNotification) {
      for (const notificationToken of user.notificationTokens) {
        pushMessages.push({
          to: notificationToken.token,
          body: `${connection.institutionName} is no longer syncing due to outdated credentials. Update the connection to resume syncing.`
        })
      }
    }
  }

  await sendPushNotifications(pushMessages)
}

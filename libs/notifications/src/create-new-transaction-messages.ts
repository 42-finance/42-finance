import { Account, HouseholdUser, NotificationSetting, NotificationToken, User, dataSource } from 'database'
import { ExpoPushMessage } from 'expo-server-sdk'
import { NotificationType } from 'shared-types'

const formatNewTransactionsMessage = (transactionCount: number) => {
  if (transactionCount === 1) {
    return `${transactionCount} new transaction has been synced`
  }

  return `${transactionCount} new transactions have been synced`
}

export const createNewTransactionMessages = async (account: Account, transactionCount: number) => {
  if (transactionCount === 0) return []

  const messages: ExpoPushMessage[] = []

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
    .andWhere('householdUser.householdId = :householdId', { householdId: account.householdId })
    .getMany()

  for (const user of users) {
    const notificationSetting = user.notificationSettings.find((n) => n.type === NotificationType.NewTransactionsSynced)
    if (notificationSetting?.sendPushNotification) {
      for (const notificationToken of user.notificationTokens) {
        messages.push({
          to: notificationToken.token,
          title: account.name,
          body: formatNewTransactionsMessage(transactionCount)
        })
      }
    }
  }

  return messages
}

import { Connection, dataSource } from 'database'
import { sendAccountSyncNotification } from 'notifications'

export const setConnectionNeedsRefresh = async (connectionId: string) => {
  await dataSource.getRepository(Connection).update(connectionId, { needsTokenRefresh: true })
  await sendAccountSyncNotification(connectionId)
}

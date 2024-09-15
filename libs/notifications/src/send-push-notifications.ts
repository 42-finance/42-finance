import Expo, { ExpoPushMessage } from 'expo-server-sdk'

export const sendPushNotifications = async (messages: ExpoPushMessage[]) => {
  const expo = new Expo()
  const chunks = expo.chunkPushNotifications(messages)
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk)
    } catch (error) {
      console.error(error)
    }
  }
}

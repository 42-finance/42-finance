import { User } from './user.type'

export type NotificationToken = {
  token: string
  userId: number
  user: User
}

import { NotificationType } from 'shared-types'
import { Column, Entity, Index, ManyToOne, PrimaryColumn, Relation } from 'typeorm'
import { User } from './user'

@Entity()
export class NotificationSetting {
  @Index()
  @PrimaryColumn({ type: 'enum', enum: NotificationType })
  type: NotificationType = NotificationType.AccountOutOfSync

  @PrimaryColumn()
  userId: number = 0

  @ManyToOne(() => User, (user) => user.notificationSettings, { onDelete: 'CASCADE' })
  user: Relation<User> = <User>{}

  @Column({ default: false })
  sendPushNotification: boolean = false

  @Column({ default: false })
  sendEmail: boolean = false

  @Column({ type: 'double precision', nullable: true })
  minimumAmount: number | null = null
}

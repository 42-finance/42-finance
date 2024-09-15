import { Column, Entity, Index, ManyToOne, PrimaryColumn, Relation } from 'typeorm'
import { User } from './user'

@Entity()
export class NotificationToken {
  @PrimaryColumn()
  token: string = ''

  @Index()
  @Column({ nullable: false })
  userId: number = 0

  @ManyToOne(() => User, (user) => user.notificationTokens, { onDelete: 'CASCADE' })
  user: Relation<User> = <User>{}
}

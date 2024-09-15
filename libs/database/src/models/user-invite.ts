import { UserPermission } from 'shared-types'
import { Column, Entity, Index, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { User } from './user'

@Entity()
export class UserInvite {
  @PrimaryColumn()
  email: string = ''

  @PrimaryColumn()
  householdId: number = 0

  @Column({ type: 'enum', enum: UserPermission })
  permission: UserPermission = UserPermission.Admin

  @Index()
  @Column({ nullable: false })
  invitedByUserId: number = 0

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  invitedByUser: Relation<User> = {} as User
}

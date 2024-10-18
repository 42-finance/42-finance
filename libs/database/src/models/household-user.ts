import { UserPermission } from 'shared-types'
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { Household } from './household'
import { User } from './user'

@Entity()
export class HouseholdUser {
  @PrimaryColumn()
  userId: number = 0

  @ManyToOne(() => User, (user) => user.householdUsers, { onDelete: 'CASCADE' })
  user: Relation<User> = {} as User

  @PrimaryColumn()
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.householdUsers, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @Column({ type: 'enum', enum: UserPermission })
  permission: UserPermission = UserPermission.Owner
}

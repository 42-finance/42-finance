import { AccountGroupType } from 'shared-types'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Account } from './account'
import { Household } from './household'

@Entity()
export class AccountGroup {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column({ type: 'enum', enum: AccountGroupType })
  type: AccountGroupType = AccountGroupType.Other

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.accounts, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => Account, (account) => account.accountGroup)
  accounts!: Account[]
}

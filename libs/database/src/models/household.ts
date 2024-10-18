import { SubscriptionType } from 'shared-types'
import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Account } from './account'
import { BalanceHistory } from './balance-history'
import { BaseEntity } from './base-entity'
import { Budget } from './budget'
import { Category } from './category'
import { Connection } from './connection'
import { Group } from './group'
import { HouseholdUser } from './household-user'
import { Merchant } from './merchant'
import { Rule } from './rule'
import { SupportTicket } from './support-ticket'
import { Tag } from './tag'
import { Transaction } from './transaction'

@Entity()
export class Household extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ length: 100, nullable: false })
  name: string = ''

  @Column({ type: String, nullable: true })
  mxUserId: string | null = null

  @Column({ type: String, nullable: true })
  finicityUserId: string | null = null

  @Column()
  @Generated('uuid')
  quilttUserId: string = ''

  @Column({ type: 'enum', enum: SubscriptionType, nullable: true })
  subscriptionOverride: SubscriptionType | null = null

  @OneToMany(() => HouseholdUser, (householdUser) => householdUser.household)
  householdUsers!: HouseholdUser[]

  @OneToMany(() => Account, (account) => account.household)
  accounts!: Account[]

  @OneToMany(() => BalanceHistory, (balanceHistory) => balanceHistory.household)
  balanceHistory!: BalanceHistory[]

  @OneToMany(() => Category, (category) => category.household)
  categories!: Category[]

  @OneToMany(() => Group, (group) => group.household)
  groups!: Group[]

  @OneToMany(() => Merchant, (merchant) => merchant.household)
  merchants!: Merchant[]

  @OneToMany(() => Rule, (rule) => rule.household)
  rules!: Rule[]

  @OneToMany(() => Connection, (connection) => connection.household)
  connections!: Connection[]

  @OneToMany(() => Transaction, (transaction) => transaction.household)
  transactions!: Transaction[]

  @OneToMany(() => Budget, (budget) => budget.household)
  budgets!: Budget[]

  @OneToMany(() => Tag, (tag) => tag.household)
  tags!: Tag[]

  @OneToMany(() => SupportTicket, (supportTicket) => supportTicket.household)
  supportTickets!: SupportTicket[]
}

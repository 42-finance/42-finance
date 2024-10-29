import { AccountSubType, AccountType, CurrencyCode, WalletType } from 'shared-types'
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, Relation } from 'typeorm'

import { AccountGroup } from './account-group'
import { BalanceHistory } from './balance-history'
import { BaseEntity } from './base-entity'
import { Connection } from './connection'
import { Goal } from './goal'
import { Household } from './household'
import { Rule } from './rule'
import { Transaction } from './transaction'

@Entity()
export class Account extends BaseEntity {
  @PrimaryColumn()
  id: string = ''

  @Column()
  name: string = ''

  @Column({ type: String, nullable: true })
  officialName: string | null = null

  @Column({ type: String, nullable: true })
  mask: string | null = null

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType = AccountType.Asset

  @Column({ type: 'enum', enum: AccountSubType })
  subType: AccountSubType = AccountSubType.Other

  @Column({ type: 'double precision' })
  currentBalance: number = 0

  @Column({ type: 'double precision', nullable: true })
  availableBalance: number | null = null

  @Column({ type: 'double precision', nullable: true })
  limit: number | null = null

  @Column({ type: 'enum', enum: CurrencyCode })
  currencyCode: CurrencyCode = CurrencyCode.CAD

  @Column({ type: Date, nullable: true })
  lastTransactionsUpdate: Date | null = null

  @Column({ type: 'enum', enum: WalletType, nullable: true })
  walletType: WalletType | null = null

  @Column({ type: String, nullable: true })
  walletAddress: string | null = null

  @Column({ type: 'double precision', nullable: true })
  walletTokenBalance: number | null = null

  @Column({ type: String, nullable: true })
  vehicleVin: string | null = null

  @Column({ type: Number, nullable: true })
  vehicleMileage: number | null = null

  @Column({ type: String, nullable: true })
  vehicleMake: string | null = null

  @Column({ type: String, nullable: true })
  vehicleModel: string | null = null

  @Column({ type: Number, nullable: true })
  vehicleYear: number | null = null

  @Column({ type: String, nullable: true })
  vehicleTrim: string | null = null

  @Column({ type: String, nullable: true })
  vehicleState: string | null = null

  @Column({ type: String, nullable: true })
  propertyAddress: string | null = null

  @Column({ default: false })
  hideFromAccountsList: boolean = false

  @Column({ default: false })
  hideFromNetWorth: boolean = false

  @Column({ default: false })
  hideFromBudget: boolean = false

  @Index()
  @Column({ type: String, nullable: true })
  connectionId: string | null = null

  @ManyToOne(() => Connection, (connection) => connection.accounts, { onDelete: 'CASCADE' })
  connection: Relation<Connection> = {} as Connection

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.accounts, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @Index()
  @Column({ type: Number, nullable: true })
  accountGroupId: number | null = null

  @ManyToOne(() => AccountGroup, (accountGroup) => accountGroup.accounts, { onDelete: 'SET NULL' })
  accountGroup: Relation<AccountGroup> = {} as AccountGroup

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[]

  @OneToMany(() => BalanceHistory, (balanceHistory) => balanceHistory.account)
  balanceHistory!: BalanceHistory[]

  @OneToMany(() => Rule, (rule) => rule.account)
  rules!: Rule[]

  @ManyToMany(() => Goal, (goal) => goal.accounts, { onDelete: 'CASCADE' })
  goals?: Goal[]

  convertedBalance?: number
}

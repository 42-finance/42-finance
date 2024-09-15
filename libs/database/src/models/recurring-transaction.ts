import { CategoryType, Frequency } from 'shared-types'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Account } from './account'
import { BaseEntity } from './base-entity'
import { Household } from './household'
import { Merchant } from './merchant'
import { Transaction } from './transaction'

@Entity()
export class RecurringTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column()
  startDate: Date = new Date()

  @Column({ type: 'enum', enum: Frequency })
  frequency: Frequency = Frequency.Daily

  @Column({ type: 'int', nullable: true })
  interval: number | null = null

  @Column({ type: 'double precision' })
  amount: number = 0

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType = CategoryType.Expense

  @Column()
  status: boolean = true

  @Index()
  @Column({ nullable: false })
  accountId: string = ''

  @ManyToOne(() => Account, (account) => account.transactions, { onDelete: 'CASCADE' })
  account: Relation<Account> = {} as Account

  @Index()
  @Column({ nullable: false })
  merchantId: number = 0

  @ManyToOne(() => Merchant, (merchant) => merchant.transactions, { onDelete: 'CASCADE' })
  merchant: Relation<Merchant> = {} as Merchant

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.transactions, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => Transaction, (transaction) => transaction.recurringTransaction)
  transactions!: Transaction[]

  convertedAmount?: number
}

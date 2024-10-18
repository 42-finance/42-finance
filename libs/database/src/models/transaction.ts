import { CurrencyCode, TransactionType } from 'shared-types'
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, Relation } from 'typeorm'

import { Account } from './account'
import { BaseEntity } from './base-entity'
import { Category } from './category'
import { Household } from './household'
import { Merchant } from './merchant'
import { RecurringTransaction } from './recurring-transaction'
import { Tag } from './tag'

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryColumn()
  id: string = ''

  @Column()
  name: string = ''

  @Column()
  date: Date = new Date()

  @Column({ type: 'double precision' })
  amount: number = 0

  @Column({ type: 'enum', enum: CurrencyCode })
  currencyCode: CurrencyCode = CurrencyCode.CAD

  @Column()
  pending: boolean = false

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType = TransactionType.Manual

  @Column()
  needsReview: boolean = false

  @Column()
  hidden: boolean = false

  @Index()
  @Column({ nullable: false })
  accountId: string = ''

  @ManyToOne(() => Account, (account) => account.transactions, { onDelete: 'CASCADE' })
  account: Relation<Account> = {} as Account

  @Index()
  @Column({ nullable: false })
  categoryId: number = 0

  @ManyToOne(() => Category, (category) => category.transactions, { onDelete: 'CASCADE' })
  category: Relation<Category> = {} as Category

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

  @Column({ default: false })
  split: boolean = false

  @Index()
  @Column({ type: String, nullable: true })
  splitTransactionId: string | null = null

  @ManyToOne(() => Transaction, (transaction) => transaction.splitTransactions, { onDelete: 'CASCADE' })
  splitTransaction: Relation<Transaction> | null = null

  @OneToMany(() => Transaction, (transaction) => transaction.splitTransaction)
  splitTransactions!: Transaction[]

  @Column({ default: '' })
  notes: string = ''

  @Column({ type: String, array: true, default: [] })
  attachments: string[] = []

  @ManyToMany(() => Tag, (tag) => tag.transactions, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'transaction_tag'
  })
  tags?: Tag[]

  @Index()
  @Column({ type: Number, nullable: true })
  recurringTransactionId: number | null = null

  @ManyToOne(() => RecurringTransaction, (recurringTransaction) => recurringTransaction.transactions, {
    onDelete: 'SET NULL'
  })
  recurringTransaction: Relation<RecurringTransaction> = {} as RecurringTransaction

  convertedAmount?: number
}

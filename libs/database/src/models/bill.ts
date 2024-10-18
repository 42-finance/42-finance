import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Account } from './account'
import { BaseEntity } from './base-entity'
import { BillPayment } from './bill-payment'
import { Household } from './household'

@Entity()
@Index('bill_issue_date_account_id', ['issueDate', 'accountId'], { unique: true })
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ type: 'double precision', nullable: true })
  balance: number | null = null

  @Column({ type: Date })
  issueDate: Date = new Date()

  @Column({ type: Date, nullable: true })
  dueDate: Date | null = null

  @Column({ type: 'double precision', nullable: true })
  minimumPaymentAmount: number | null = null

  @Column({ type: Boolean, nullable: true })
  isOverdue: boolean | null = null

  @Index()
  @Column({ nullable: false })
  accountId: string = ''

  @ManyToOne(() => Account, (account) => account.balanceHistory, { onDelete: 'CASCADE' })
  account: Relation<Account> = {} as Account

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.balanceHistory, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  convertedBalance?: number | null
  isPaid?: boolean
  billPayments?: BillPayment[]
}

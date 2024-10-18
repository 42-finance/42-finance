import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Account } from './account'
import { BaseEntity } from './base-entity'
import { Household } from './household'

@Entity()
@Index('bill_payment_amount_date_account_id', ['amount', 'date', 'accountId'], { unique: true })
export class BillPayment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ type: 'double precision' })
  amount: number = 0

  @Column({ type: Date })
  date: Date = new Date()

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

  convertedAmount?: number
}

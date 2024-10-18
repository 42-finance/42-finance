import { Column, Entity, Index, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { Account } from './account'
import { Household } from './household'

@Entity()
export class BalanceHistory {
  @Index()
  @PrimaryColumn()
  date: Date = new Date()

  @Column({ type: 'double precision' })
  currentBalance: number = 0

  @Column({ type: 'double precision', nullable: true })
  availableBalance: number | null = null

  @Column({ type: 'double precision', nullable: true })
  limit: number | null = null

  @Column({ type: 'double precision', nullable: true })
  walletTokenBalance: number | null = null

  @Index()
  @PrimaryColumn({ nullable: false })
  accountId: string = ''

  @ManyToOne(() => Account, (account) => account.balanceHistory, { onDelete: 'CASCADE' })
  account: Relation<Account> = {} as Account

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.balanceHistory, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  convertedBalance?: number
}

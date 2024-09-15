import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { BaseEntity } from './base-entity'
import { Household } from './household'
import { Transaction } from './transaction'

@Entity()
export class Merchant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column()
  systemName: string = ''

  @Column({ type: String, nullable: true })
  icon: string | null = null

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.merchants, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => Transaction, (transaction) => transaction.merchant)
  transactions!: Transaction[]
}

import { Column, Entity, Index, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Household } from './household'
import { Transaction } from './transaction'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column()
  color: string = ''

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.categories, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @ManyToMany(() => Transaction, (transaction) => transaction.tags)
  transactions?: Transaction[]
}

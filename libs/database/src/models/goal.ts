import { GoalType } from 'shared-types'
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Account } from './account'
import { BaseEntity } from './base-entity'
import { Household } from './household'

@Entity()
export class Goal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column({ type: 'double precision' })
  amount: number = 0

  @Column({ type: 'enum', enum: GoalType })
  type: GoalType = GoalType.Savings

  @Column({ type: Date, nullable: true })
  targetDate: Date | null = null

  @Column({ type: Number, nullable: true })
  budgetAmount: number | null = null

  @ManyToMany(() => Account, (account) => account.goals, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({
    name: 'goal_account'
  })
  accounts?: Account[]

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.budgets, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household
}

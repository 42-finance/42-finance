import { SystemCategory } from 'shared-types'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Budget } from './budget'
import { Group } from './group'
import { Household } from './household'
import { Rule } from './rule'
import { Transaction } from './transaction'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column({ type: 'enum', enum: SystemCategory, nullable: true })
  systemCategory: SystemCategory | null = null

  @Column()
  icon: string = ''

  @Column({ type: Number, nullable: true })
  mapToCategoryId: number | null = null

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  mapToCategory: Category | null = null

  @Column({ default: false })
  hideFromBudget: boolean = false

  @Column({ default: false })
  rolloverBudget: boolean = false

  @Index()
  @Column({ nullable: false })
  groupId: number = 0

  @ManyToOne(() => Group, (group) => group.categories, { onDelete: 'CASCADE' })
  group: Relation<Group> = {} as Group

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.categories, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[]

  @OneToMany(() => Rule, (rule) => rule.account)
  rules!: Rule[]

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets!: Budget[]
}

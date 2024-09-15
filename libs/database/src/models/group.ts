import { BudgetType, CategoryType } from 'shared-types'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { BaseEntity } from './base-entity'
import { Category } from './category'
import { Household } from './household'

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  name: string = ''

  @Column({ type: 'enum', enum: CategoryType })
  type: CategoryType = CategoryType.Expense

  @Column()
  icon: string = ''

  @Column({ type: 'enum', enum: BudgetType, default: BudgetType.Category })
  budgetType: BudgetType = BudgetType.Category

  @Column({ default: false })
  hideFromBudget: boolean = false

  @Column({ default: false })
  rolloverBudget: boolean = false

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.groups, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => Category, (category) => category.group)
  categories!: Category[]
}

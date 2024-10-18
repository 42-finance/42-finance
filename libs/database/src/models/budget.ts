import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { BaseEntity } from './base-entity'
import { Category } from './category'
import { Household } from './household'

@Entity()
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  amount: number = 0

  @Index()
  @Column({ nullable: false })
  categoryId: number = 0

  @ManyToOne(() => Category, (category) => category.budgets, { onDelete: 'CASCADE' })
  category: Relation<Category> = <Category>{}

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.budgets, { onDelete: 'CASCADE' })
  household: Relation<Household> = <Household>{}
}

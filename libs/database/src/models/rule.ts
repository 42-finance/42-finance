import { AmountFilter, NameFilter, TransactionAmountType } from 'shared-types'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { Account } from './account'
import { Category } from './category'
import { Household } from './household'

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ default: 1 })
  priority: number = 1

  @Column({ type: 'enum', enum: NameFilter, nullable: true })
  merchantValueFilter: NameFilter | null = null

  @Column({ type: String, nullable: true })
  merchantName: string | null = null

  @Column({ type: String, nullable: true })
  merchantOriginalStatement: string | null = null

  @Column({ type: 'enum', enum: TransactionAmountType, nullable: true })
  amountType: TransactionAmountType | null = null

  @Column({ type: 'enum', enum: AmountFilter, nullable: true })
  amountFilterType: AmountFilter | null = null

  @Column({ type: 'float', nullable: true })
  amountValue: number | null = null

  @Column({ type: 'float', nullable: true })
  amountValue2: number | null = null

  @Index()
  @Column({ nullable: true })
  categoryId: number | null = null

  @ManyToOne(() => Category, (category) => category.rules, { onDelete: 'CASCADE' })
  category: Relation<Category> | null = null

  @Index()
  @Column({ nullable: true })
  accountId: string | null = null

  @ManyToOne(() => Account, (account) => account.rules, { onDelete: 'CASCADE' })
  account: Relation<Account> | null = null

  @Column({ type: String, nullable: true })
  newMerchantName: string | null = null

  @Index()
  @Column({ nullable: true })
  newCategoryId: number | null = null

  @ManyToOne(() => Category, (category) => category.rules, { onDelete: 'CASCADE' })
  newCategory: Relation<Category> = <Category>{}

  @Column({ type: Boolean, nullable: true })
  hideTransaction: boolean | null = null

  @Column({ type: Boolean, nullable: true })
  needsReview: boolean | null = null

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.rules, { onDelete: 'CASCADE' })
  household: Relation<Household> = <Household>{}
}

import { InvoiceType } from 'shared-types'
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { Expense } from './expense'
import { Property } from './property'
import { RentalUnit } from './rental-unit'
import { Transaction } from './transaction'
@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ type: 'float' })
  amount: number = 0

  @Column()
  date: Date = new Date()

  @Column({ type: 'enum', enum: InvoiceType })
  type: InvoiceType = InvoiceType.Rent

  @ManyToOne(() => RentalUnit, (rentalUnit) => rentalUnit.invoices, {
    onDelete: 'CASCADE'
  })
  rentalUnit: Relation<RentalUnit> | null = null

  @Column({ nullable: true })
  rentalUnitId: number | null = null

  @ManyToOne(() => Property, (property) => property.invoices, {
    onDelete: 'CASCADE'
  })
  property: Relation<Property> = <Property>{}

  @Column({ nullable: false })
  propertyId: number = 0

  @ManyToOne(() => Expense, (expense) => expense.invoices, { onDelete: 'CASCADE' })
  expense: Relation<Expense> | null = null

  @Index()
  @Column({ type: Number, nullable: true })
  expenseId: number | null = null

  @Column({ type: String, nullable: true })
  transactionId: string | null = null

  @OneToOne(() => Transaction, { onDelete: 'SET NULL' })
  @JoinColumn()
  transaction: Relation<Transaction> = <Transaction>{}
}

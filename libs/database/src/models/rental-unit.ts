import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { Expense } from './expense'
import { Invoice } from './invoice'
import { Property } from './property'
import { Tenant } from './tenant'

@Entity()
@Index(['name', 'property'], { unique: true })
export class RentalUnit {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ length: 100 })
  name: string = ''

  @Column()
  rent: number = 0

  @Column()
  rentDueDayOfMonth: number = 0

  @ManyToOne(() => Property, (property) => property.rentalUnits, { onDelete: 'CASCADE' })
  property: Relation<Property> = <Property>{}

  @Index()
  @Column({ nullable: false })
  propertyId: number = 0

  @OneToMany(() => Tenant, (tenant) => tenant.rentalUnit)
  tenants!: Tenant[]

  @OneToMany(() => Invoice, (invoice) => invoice.rentalUnit)
  invoices!: Invoice[]

  @OneToMany(() => Expense, (expense) => expense.rentalUnit)
  expenses!: Expense[]

  nextRentInvoice?: Invoice
  tenantCount?: number
  totalRent?: number
  totalExpenses?: number
  totalMaintenance?: number
  cashFlow?: number
}

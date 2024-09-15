import { Frequency } from 'shared-types'
import { Check, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { Invoice } from './invoice'
import { Property } from './property'
import { RentalUnit } from './rental-unit'

@Entity()
@Check('("propertyId" IS NOT NULL AND "rentalUnitId" IS NULL) OR ("propertyId" IS NULL AND "rentalUnitId" IS NOT NULL)')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ length: 100 })
  name: string = ''

  @Column({ nullable: true })
  description: string = ''

  @Column({ type: 'float' })
  amount: number = 0

  @Column({ type: 'enum', enum: Frequency })
  frequency: Frequency = Frequency.Daily

  @Column()
  dateOfFirstOccurence: Date = new Date()

  @ManyToOne(() => Property, (property) => property.expenses, { onDelete: 'CASCADE' })
  property: Relation<Property> = {} as Property

  @Index()
  @Column()
  propertyId: number = 0

  @ManyToOne(() => RentalUnit, (rentalUnit) => rentalUnit.expenses, { onDelete: 'CASCADE' })
  rentalUnit: Relation<RentalUnit> = {} as RentalUnit

  @Index()
  @Column({ type: Number, nullable: true })
  rentalUnitId: number | null = null

  @OneToMany(() => Invoice, (invoice) => invoice.expense)
  invoices!: Invoice[]
}

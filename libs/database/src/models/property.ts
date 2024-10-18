import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { Expense } from './expense'
import { Invoice } from './invoice'
import { RentalUnit } from './rental-unit'
import { User } from './user'

@Entity()
@Index(['nickname', 'landlord'], { unique: true })
export class Property {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ type: String, length: 100, nullable: true })
  nickname: string | null = null

  @Column({ length: 100 })
  address: string = ''

  @Column({ length: 100 })
  city: string = ''

  @Column({ length: 100 })
  territory: string = ''

  @Column({ length: 100 })
  country: string = ''

  @Column({ length: 100 })
  postalCode: string = ''

  @ManyToOne(() => User, (landlord) => landlord.properties, { onDelete: 'CASCADE' })
  landlord: Relation<User> = <User>{}

  @Index()
  @Column({ nullable: false })
  landlordId: number = 0

  @OneToMany(() => RentalUnit, (rentalUnit) => rentalUnit.property)
  rentalUnits!: RentalUnit[]

  @OneToMany(() => Invoice, (invoice) => invoice.rentalUnit)
  invoices!: Invoice[]

  @OneToMany(() => Expense, (expense) => expense.property)
  expenses!: Expense[]

  isLandlord?: boolean
  tenantCount?: number
  totalRent?: number
  totalExpenses?: number
  cashFlow?: number
}

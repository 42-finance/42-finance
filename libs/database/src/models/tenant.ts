import { InvitationState } from 'shared-types'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { RentalUnit } from './rental-unit'
import { User } from './user'

@Entity()
@Index(['userId', 'rentalUnitId'], { unique: true })
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({ type: 'enum', enum: InvitationState, default: InvitationState.Pending })
  invitationState: InvitationState = InvitationState.Pending

  @Column({ type: Date, nullable: true })
  moveOutDate: Date | null = null

  @Column({ type: 'bigint', nullable: true })
  rotessaCustomerId: number | null = null

  @ManyToOne(() => User, (user) => user.tenants, { onDelete: 'CASCADE' })
  user: Relation<User> = <User>{}

  @Index()
  @Column({ nullable: false })
  userId: number = 0

  @ManyToOne(() => RentalUnit, (rentalUnit) => rentalUnit.tenants, { onDelete: 'CASCADE' })
  rentalUnit: Relation<RentalUnit> = <RentalUnit>{}

  @Index()
  @Column({ nullable: false })
  rentalUnitId: number = 0
}

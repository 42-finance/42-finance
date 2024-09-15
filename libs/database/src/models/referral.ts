import { Column, Entity, Index, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { Household } from './household'

@Entity()
export class Referral {
  @Index()
  @PrimaryColumn()
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.accounts, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @Index()
  @PrimaryColumn()
  referredByHouseholdId: number = 0

  @ManyToOne(() => Household, (household) => household.accounts, { onDelete: 'CASCADE' })
  referredByHousehold: Relation<Household> = {} as Household

  @Column({ nullable: false })
  date: Date = new Date()
}

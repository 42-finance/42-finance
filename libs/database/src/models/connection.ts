import { ConnectionType } from 'shared-types'
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, Relation } from 'typeorm'

import { Account } from './account'
import { BaseEntity } from './base-entity'
import { Household } from './household'

@Entity()
export class Connection extends BaseEntity {
  @PrimaryColumn()
  id: string = ''

  @Column()
  institutionId: string = ''

  @Column()
  institutionName: string = ''

  @Column({ type: String, nullable: true })
  institutionLogo: string | null = null

  @Column({ type: String, nullable: true })
  accessToken: string | null = null

  @Column({ type: String, nullable: true })
  transactionsCursor: string | null = null

  @Column({ default: false })
  needsTokenRefresh: boolean = false

  @Column({ type: 'enum', enum: ConnectionType })
  type: ConnectionType = ConnectionType.Plaid

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.connections, { onDelete: 'RESTRICT' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => Account, (account) => account.connection)
  accounts!: Account[]
}

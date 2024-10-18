import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { BaseEntity } from './base-entity'
import { Household } from './household'
import { SupportTicketComment } from './support-ticket-comment'

@Entity()
export class SupportTicket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  title: string = ''

  @Index()
  @Column({ nullable: false })
  householdId: number = 0

  @ManyToOne(() => Household, (household) => household.supportTickets, { onDelete: 'CASCADE' })
  household: Relation<Household> = {} as Household

  @OneToMany(() => SupportTicketComment, (comment) => comment.supportTicket)
  comments!: SupportTicketComment[]
}

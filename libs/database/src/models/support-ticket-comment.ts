import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { BaseEntity } from './base-entity'
import { SupportTicket } from './support-ticket'

@Entity()
export class SupportTicketComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column()
  content: string = ''

  @Index()
  @Column({ nullable: false })
  supportTicketId: number = 0

  @ManyToOne(() => SupportTicket, (supportTicket) => supportTicket.comments, { onDelete: 'CASCADE' })
  supportTicket: Relation<SupportTicket> = {} as SupportTicket
}

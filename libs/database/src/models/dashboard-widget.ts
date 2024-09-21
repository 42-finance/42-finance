import { DashboardWidgetType } from 'shared-types'
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm'

import { User } from './user'

@Entity()
export class DashboardWidget {
  @PrimaryColumn({ type: 'enum', enum: DashboardWidgetType })
  type: DashboardWidgetType = DashboardWidgetType.NetWorth

  @PrimaryColumn()
  userId: number = 0

  @ManyToOne(() => User, (user) => user.dashboardWidgets, { onDelete: 'CASCADE' })
  user: Relation<User> = {} as User

  @Column()
  order: number = 0

  @Column()
  isSelected: boolean = false
}

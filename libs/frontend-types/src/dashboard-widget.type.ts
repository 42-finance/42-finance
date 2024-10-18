import { DashboardWidgetType } from 'shared-types'

export type DashboardWidget = {
  type: DashboardWidgetType
  order: number
  isSelected: boolean
}

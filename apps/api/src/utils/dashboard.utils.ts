import { DashboardWidget, dataSource } from 'database'
import { DashboardWidgetType } from 'shared-types'
import { EntityManager } from 'typeorm'

export const createDefaultDashboardWidgets = async (
  userId: number,
  entityManager: EntityManager = dataSource.manager
) => {
  let order = 0

  for (const type of Object.values(DashboardWidgetType)) {
    await entityManager
      .getRepository(DashboardWidget)
      .createQueryBuilder()
      .insert()
      .values({
        type,
        order,
        isSelected: true,
        userId
      })
      .orIgnore()
      .execute()
    order++
  }
}

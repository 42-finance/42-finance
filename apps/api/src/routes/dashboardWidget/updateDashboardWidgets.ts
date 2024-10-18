import { DashboardWidget, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateDashboardWidgetsRequest = {
  widgets: DashboardWidget[]
}

export const updateDashboardWidgets = async (
  request: Request<{}, {}, UpdateDashboardWidgetsRequest, {}>,
  response: Response<HTTPResponseBody>
) => {
  const { userId } = request
  const { widgets } = request.body

  await dataSource.transaction(async (entityManager) => {
    for (const widget of widgets) {
      await entityManager
        .getRepository(DashboardWidget)
        .createQueryBuilder('dashboardWidget')
        .insert()
        .values({
          type: widget.type,
          order: widget.order,
          isSelected: widget.isSelected,
          userId
        })
        .orUpdate(['order', 'isSelected'], ['type', 'userId'])
        .execute()
    }

    return response.send({
      errors: [],
      payload: {
        message: 'Widgets updated'
      }
    })
  })
}
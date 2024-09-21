import { DashboardWidget, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getDashboardWidgets = async (request: Request<{}, {}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { userId } = request

  const dashboardWidgets = await dataSource
    .getRepository(DashboardWidget)
    .createQueryBuilder('dashboardWidget')
    .where('dashboardWidget.userId = :userId', { userId })
    .addOrderBy('dashboardWidget.order')
    .getMany()

  return response.send({
    errors: [],
    payload: dashboardWidgets
  })
}

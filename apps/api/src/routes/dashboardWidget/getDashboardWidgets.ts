import { DashboardWidget, dataSource } from 'database'
import { Request, Response } from 'express'
import semver from 'semver'
import { DashboardWidgetType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getDashboardWidgets = async (request: Request<{}, {}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { userId, appVersion } = request

  let dashboardWidgets = await dataSource
    .getRepository(DashboardWidget)
    .createQueryBuilder('dashboardWidget')
    .where('dashboardWidget.userId = :userId', { userId })
    .addOrderBy('dashboardWidget.order')
    .getMany()

  if (appVersion == null || semver.lt(appVersion, '1.1.1')) {
    dashboardWidgets = dashboardWidgets.filter((d) => d.type !== DashboardWidgetType.DateSpending)
  }

  return response.send({
    errors: [],
    payload: dashboardWidgets
  })
}

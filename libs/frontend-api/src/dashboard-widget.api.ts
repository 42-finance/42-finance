import { DashboardWidget } from 'frontend-types'

import { config } from './config'
import { get, patch } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getDashboardWidgets = async () =>
  get<HTTPResponseBody<DashboardWidget[]>>(`${config.apiUrl}/dashboard-widgets`)

export type EditDashboardWidgetsRequest = {
  widgets: DashboardWidget[]
}

export const editDashboardWidgets = async (body: EditDashboardWidgetsRequest) =>
  patch<HTTPResponseBody<DashboardWidget[]>>(`${config.apiUrl}/dashboard-widgets`, body)

import { Router } from 'express'

import { getDashboardWidgets } from './getDashboardWidgets'
import { updateDashboardWidgets } from './updateDashboardWidgets'

const dashboardWidgetsRouter = Router()
dashboardWidgetsRouter.get('/', getDashboardWidgets)
dashboardWidgetsRouter.patch('/', updateDashboardWidgets)
export { dashboardWidgetsRouter }

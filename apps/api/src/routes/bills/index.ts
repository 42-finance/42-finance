import { Router } from 'express'

import { getBill } from './getBill'
import { getBills } from './getBills'

const billsRouter = Router()
billsRouter.get('/', getBills)
billsRouter.get('/:id', getBill)
export { billsRouter }

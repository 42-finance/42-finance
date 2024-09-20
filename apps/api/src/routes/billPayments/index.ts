import { Router } from 'express'

import { getBillPayments } from './getBillPayments'

const billPaymentsRouter = Router()
billPaymentsRouter.get('/', getBillPayments)
export { billPaymentsRouter }

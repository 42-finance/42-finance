import { Router } from 'express'

import createRentPayment from './createRentPayment'
import createTenant from './createTenant'
import deleteTenant from './deleteTenant'
import getRentPayment from './getRentPayment'
import getTenant from './getTenant'
import getTenants from './getTenants'
import updateTenant from './updateTenant'

const tenantRouter = Router()
tenantRouter.get('/', getTenants)
tenantRouter.get('/:id', getTenant)
tenantRouter.get('/:id/rentPayment', getRentPayment)
tenantRouter.post('/', createTenant)
tenantRouter.post('/:id/rentPayment', createRentPayment)
tenantRouter.patch('/:id', updateTenant)
tenantRouter.delete('/:id', deleteTenant)
export default tenantRouter

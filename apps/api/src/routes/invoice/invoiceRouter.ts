import { Router } from 'express'

import getRentInvoice from './getInvoice'
import getRentInvoices from './getInvoices'
import updateRentInvoice from './updateInvoice'

const invoiceRouter = Router()
invoiceRouter.get('/', getRentInvoices)
invoiceRouter.get('/:id', getRentInvoice)
invoiceRouter.patch('/:id', updateRentInvoice)
export default invoiceRouter

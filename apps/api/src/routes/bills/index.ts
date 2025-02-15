import { Router } from 'express'

import { createBill } from './createBill'
import { deleteBill } from './deleteBill'
import { getBill } from './getBill'
import { getBills } from './getBills'
import { updateBill } from './updateBill'

const billsRouter = Router()
billsRouter.get('/', getBills)
billsRouter.get('/:id', getBill)
billsRouter.post('/', createBill)
billsRouter.patch('/:id', updateBill)
billsRouter.delete('/:id', deleteBill)

export { billsRouter }

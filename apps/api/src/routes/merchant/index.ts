import { Router } from 'express'

import { deleteMerchant } from './deleteMerchant'
import { getMerchant } from './getMerchant'
import { getMerchants } from './getMerchants'
import { updateMerchant } from './updateMerchant'

const merchantRouter = Router()
merchantRouter.get('/', getMerchants)
merchantRouter.get('/:id', getMerchant)
merchantRouter.patch('/:id', updateMerchant)
merchantRouter.delete('/:id', deleteMerchant)
export { merchantRouter }

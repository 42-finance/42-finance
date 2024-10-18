import { Router } from 'express'

import { createAccount } from './createAccount'
import { deleteAccount } from './deleteAccount'
import { getAccount } from './getAccount'
import { getAccounts } from './getAccounts'
import { refreshAccount } from './refreshAccount'
import { updateAccount } from './updateAccount'

const accountRouter = Router()
accountRouter.get('/', getAccounts)
accountRouter.get('/:id', getAccount)
accountRouter.post('/', createAccount)
accountRouter.patch('/:id', updateAccount)
accountRouter.patch('/:id/refresh', refreshAccount)
accountRouter.delete('/:id', deleteAccount)

export { accountRouter }

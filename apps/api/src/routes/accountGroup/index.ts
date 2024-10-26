import { Router } from 'express'

import { createAccountGroup } from './createAccountGroup'
import { deleteAccountGroup } from './deleteAccountGroup'
import { getAccountGroup } from './getAccountGroup'
import { getAccountGroups } from './getAccountGroups'
import { updateAccountGroup } from './updateAccountGroup'

const accountGroupRouter = Router()
accountGroupRouter.get('/', getAccountGroups)
accountGroupRouter.get('/:id', getAccountGroup)
accountGroupRouter.post('/', createAccountGroup)
accountGroupRouter.patch('/:id', updateAccountGroup)
accountGroupRouter.delete('/:id', deleteAccountGroup)

export { accountGroupRouter }

import { createGroup } from './createGroup'
import { deleteGroup } from './deleteGroup'
import { getGroup } from './getGroup'
import { getGroups } from './getGroups'
import { updateGroup } from './updateGroup'
import { Router } from 'express'

const groupRouter = Router()
groupRouter.get('/', getGroups)
groupRouter.get('/:id', getGroup)
groupRouter.post('/', createGroup)
groupRouter.patch('/:id', updateGroup)
groupRouter.delete('/:id', deleteGroup)
export { groupRouter }

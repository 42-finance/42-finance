import { Router } from 'express'

import { deleteConnection } from './deleteConnection'
import { getConnections } from './getConnections'
import { updateConnection } from './updateConnection'

const connectionRouter = Router()
connectionRouter.get('/', getConnections)
connectionRouter.patch('/:id', updateConnection)
connectionRouter.delete('/:id', deleteConnection)

export { connectionRouter }

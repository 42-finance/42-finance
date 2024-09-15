import { Router } from 'express'

import createProperty from './createProperty'
import deleteProperty from './deleteProperty'
import getProperties from './getProperties'
import getProperty from './getProperty'
import updateProperty from './updateProperty'

const propertyRouter = Router()
propertyRouter.post('/', createProperty)
propertyRouter.get('/', getProperties)
propertyRouter.get('/:id', getProperty)
propertyRouter.patch('/:id', updateProperty)
propertyRouter.delete('/:id', deleteProperty)
export { propertyRouter }

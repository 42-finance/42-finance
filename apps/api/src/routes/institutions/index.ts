import { Router } from 'express'

import { getInstitutions } from './getInstitutions'

const institutionsRouter = Router()
institutionsRouter.get('/', getInstitutions)

export { institutionsRouter }

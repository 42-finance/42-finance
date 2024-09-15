import { Router } from 'express'

import { deleteHouseholdUser } from './deleteHouseholdUser'
import { getHouseholdUsers } from './getHouseholdUsers'

const householdRouter = Router()
householdRouter.get('/users', getHouseholdUsers)
householdRouter.delete('/users/:id', deleteHouseholdUser)

export { householdRouter }

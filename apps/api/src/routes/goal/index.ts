import { Router } from 'express'

import { createGoal } from './createGoal'
import { deleteGoal } from './deleteGoal'
import { getGoal } from './getGoal'
import { getGoals } from './getGoals'
import { updateGoal } from './updateGoal'

const goalRouter = Router()
goalRouter.get('/', getGoals)
goalRouter.get('/:id', getGoal)
goalRouter.post('/', createGoal)
goalRouter.patch('/:id', updateGoal)
goalRouter.delete('/:id', deleteGoal)
export { goalRouter }

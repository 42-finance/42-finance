import { Router } from 'express'
import { getBudgets } from './getBudgets'
import { updateBudget } from './updateBudget'

const budgetRouter = Router()
budgetRouter.get('/', getBudgets)
budgetRouter.patch('/', updateBudget)
export { budgetRouter }

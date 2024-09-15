import { Router } from 'express'

import createExpense from './createExpense'
import deleteExpense from './deleteExpense'
import getExpense from './getExpense'
import getExpenses from './getExpenses'
import updateExpense from './updateExpense'

const expenseRouter = Router()
expenseRouter.post('/', createExpense)
expenseRouter.get('/', getExpenses)
expenseRouter.get('/:id', getExpense)
expenseRouter.patch('/:id', updateExpense)
expenseRouter.delete('/:id', deleteExpense)
export default expenseRouter

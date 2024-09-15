import { Router } from 'express'

import { createRecurringTransaction } from './createRecurringTransaction'
import { deleteRecurringTransaction } from './deleteRecurringTransaction'
import { getRecurringTransaction } from './getRecurringTransaction'
import { getRecurringTransactions } from './getRecurringTransactions'
import { updateRecurringTransaction } from './updateRecurringTransaction'

const recurringTransactionRouter = Router()
recurringTransactionRouter.get('/', getRecurringTransactions)
recurringTransactionRouter.get('/:id', getRecurringTransaction)
recurringTransactionRouter.post('/', createRecurringTransaction)
recurringTransactionRouter.patch('/:id', updateRecurringTransaction)
recurringTransactionRouter.delete('/:id', deleteRecurringTransaction)
export { recurringTransactionRouter }

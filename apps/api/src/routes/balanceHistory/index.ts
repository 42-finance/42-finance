import { Router } from 'express'

import deleteBalanceHistory from './deleteBalanceHistory'
import { getBalanceHistory } from './getBalanceHistory'
import updateBalanceHistory from './updateBalanceHistory'

const balanceHistoryRouter = Router()
balanceHistoryRouter.get('/', getBalanceHistory)
balanceHistoryRouter.patch('/:accountId', updateBalanceHistory)
balanceHistoryRouter.delete('/:accountId', deleteBalanceHistory)
export { balanceHistoryRouter }

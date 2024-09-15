import { Router } from 'express'
import { getBalanceHistory } from './getBalanceHistory'

const balanceHistoryRouter = Router()
balanceHistoryRouter.get('/', getBalanceHistory)
export { balanceHistoryRouter }

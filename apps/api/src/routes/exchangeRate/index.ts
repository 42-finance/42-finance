import { Router } from 'express'

import { getExchangeRates } from './getExchangeRates'

const exchangeRateRouter = Router()
exchangeRateRouter.get('/', getExchangeRates)

export { exchangeRateRouter }

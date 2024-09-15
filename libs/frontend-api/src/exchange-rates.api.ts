import { ExchangeRate } from 'frontend-types'

import { config } from './config'
import { get } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export const getExchangeRates = async () => get<HTTPResponseBody<ExchangeRate[]>>(`${config.apiUrl}/exchange-rates`)

import { ExchangeRate, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getExchangeRates = async (request: Request, response: Response<HTTPResponseBody>) => {
  const exchangeRates = await dataSource
    .getRepository(ExchangeRate)
    .createQueryBuilder('exchangeRate')
    .addOrderBy('exchangeRate.currencyCode')
    .addOrderBy('exchangeRate.date', 'DESC')
    .distinctOn(['exchangeRate.currencyCode'])
    .getMany()

  return response.send({
    errors: [],
    payload: exchangeRates
  })
}

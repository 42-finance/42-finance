import { ExchangeRate, dataSource } from 'database'
import { CurrencyCode } from 'shared-types'

const exchangeRates: Record<CurrencyCode, number> = {} as Record<CurrencyCode, number>

export const getExchangeRateFromUSD = async (currencyCode: CurrencyCode) => {
  if (exchangeRates[currencyCode]) {
    return exchangeRates[currencyCode]
  }
  const { exchangeRate } = await dataSource
    .getRepository(ExchangeRate)
    .createQueryBuilder('exchangeRate')
    .where('exchangeRate.currencyCode = :currencyCode', { currencyCode })
    .orderBy('exchangeRate.date', 'DESC')
    .getOneOrFail()
  exchangeRates[currencyCode] = exchangeRate
  return exchangeRate
}

export const getExchangeRate = async (fromCurrencyCode: CurrencyCode, toCurrencyCode: CurrencyCode) => {
  const fromExchangeRate = await getExchangeRateFromUSD(fromCurrencyCode)
  const toExchangeRate = await getExchangeRateFromUSD(toCurrencyCode)
  return (1 / fromExchangeRate) * toExchangeRate
}

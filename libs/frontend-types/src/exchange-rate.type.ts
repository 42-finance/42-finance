import { CurrencyCode } from 'shared-types'

export type ExchangeRate = {
  date: Date
  currencyCode: CurrencyCode
  exchangeRate: number
}

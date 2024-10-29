import getSymbolFromCurrency from 'currency-symbol-map'
import { CurrencyCode } from 'shared-types'

export const formatDollars = (value: number | null, currencyCode: CurrencyCode, decimals: number = 2) => {
  const symbol = getSymbolFromCurrency(currencyCode) ?? '$'

  if (value == null) {
    return `${symbol}0.00`
  }

  return (
    symbol +
    Number(Math.abs(value).toFixed(2)).toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  )
}

export const formatDollarsSigned = (value: number | null, currencyCode: CurrencyCode, decimals: number = 2) => {
  const symbol = getSymbolFromCurrency(currencyCode) ?? '$'

  if (value == null) {
    return `${symbol}0.00`
  }

  return (
    (value < 0 ? '-' : '') +
    symbol +
    Number(Math.abs(value).toFixed(2)).toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  )
}

export const formatPercentage = (value: number | null, decimals: number = 1) => {
  if (value == null) return '0.0%'
  if (value > 100) return '100.0%'
  return (
    Number(value.toFixed(2)).toLocaleString('en', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + '%'
  )
}

export const getCurrencySymbol = (currencyCode: CurrencyCode) => {
  return getSymbolFromCurrency(currencyCode) ?? '$'
}

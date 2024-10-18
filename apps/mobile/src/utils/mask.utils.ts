import { getCurrencySymbol } from 'frontend-utils'
import { createNumberMask } from 'react-native-mask-input'
import { CurrencyCode } from 'shared-types'

export const dollarMask = (currencyCode: CurrencyCode) =>
  createNumberMask({
    prefix: [getCurrencySymbol(currencyCode)],
    delimiter: ',',
    separator: '.',
    precision: 0
  })

export const dollarCentMask = (currencyCode: CurrencyCode) =>
  createNumberMask({
    prefix: [getCurrencySymbol(currencyCode)],
    delimiter: ',',
    separator: '.',
    precision: 2
  })

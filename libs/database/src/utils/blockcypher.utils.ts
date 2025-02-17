import { CurrencyCode } from 'shared-types'

import { dataSource, ExchangeRate } from '..'
import { blockcypherConfig } from '../common/config'

type BlockcypherAddressInfoResponse = {
  balance: number
}

export const getBitcoinBalance = async (walletAddress: string, currencyCode: CurrencyCode) => {
  const response = await fetch(`${blockcypherConfig.apiUrl}/addrs/${walletAddress}/balance`)

  let responseBody: BlockcypherAddressInfoResponse | null = null
  try {
    responseBody = await response.json()
  } catch (error) {
    console.log(error)
  }

  if (!responseBody) {
    return {
      currentBalance: null as number | null,
      walletTokenBalance: null as number | null
    }
  }

  const btcExchangeRate = await dataSource
    .getRepository(ExchangeRate)
    .createQueryBuilder('exchangeRate')
    .where('exchangeRate.currencyCode = :currencyCode', { currencyCode: CurrencyCode.BTC })
    .getOneOrFail()

  const balance = responseBody.balance / 100_000_000
  const usdBalance = balance / btcExchangeRate.exchangeRate

  const exchangeRate = await dataSource
    .getRepository(ExchangeRate)
    .createQueryBuilder('exchangeRate')
    .where('exchangeRate.currencyCode = :currencyCode', { currencyCode })
    .getOneOrFail()

  return {
    currentBalance: usdBalance * exchangeRate.exchangeRate,
    walletTokenBalance: balance
  }
}

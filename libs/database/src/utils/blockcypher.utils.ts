import { CurrencyCode } from 'shared-types'

import { blockcypherConfig } from '../common/config'
import { getExchangeRate } from './exchange-rate.utils'

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

  const balance = responseBody.balance / 100_000_000
  const exchangeRate = await getExchangeRate(CurrencyCode.BTC, currencyCode)

  return {
    currentBalance: balance * exchangeRate,
    walletTokenBalance: balance
  }
}

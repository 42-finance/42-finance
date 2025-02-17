import { getExchangeRate } from 'database'
import { CurrencyCode } from 'shared-types'
import { ethplorerConfig } from '../common/config'

type EthplorerAddressInfoResponse = {
  ETH: {
    price: {
      rate: number
    }
    balance: number
  }
}

export const getEthereumBalance = async (walletAddress: string, currencyCode: CurrencyCode) => {
  const response = await fetch(
    `${ethplorerConfig.apiUrl}/getAddressInfo/${walletAddress}?apiKey=${ethplorerConfig.apiKey}`
  )

  let responseBody: EthplorerAddressInfoResponse | null = null
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

  const usdBalance = responseBody.ETH.balance * responseBody.ETH.price.rate
  const exchangeRate = await getExchangeRate(CurrencyCode.USD, currencyCode)

  return {
    currentBalance: usdBalance * exchangeRate,
    walletTokenBalance: responseBody.ETH.balance
  }
}

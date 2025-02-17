import { ExchangeRate, dataSource } from 'database'
import { ethplorerConfig } from '../common/config'

type EthplorerAddressInfoResponse = {
  ETH: {
    price: {
      rate: number
    }
    balance: number
  }
}

export const getEthereumBalance = async (walletAddress: string, currencyCode: string) => {
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

  const exchangeRate = await dataSource
    .getRepository(ExchangeRate)
    .createQueryBuilder('exchangeRate')
    .where('exchangeRate.currencyCode = :currencyCode', { currencyCode })
    .getOneOrFail()

  return {
    currentBalance: usdBalance * exchangeRate.exchangeRate,
    walletTokenBalance: responseBody.ETH.balance
  }
}

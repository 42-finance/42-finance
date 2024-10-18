import { ExchangeRate, dataSource } from 'database'
import fetch from 'node-fetch'
import { config } from '../../../../apps/api/src/common/config'

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
    `${config.ethplorer.apiUrl}/getAddressInfo/${walletAddress}?apiKey=${config.ethplorer.apiKey}`,
    {
      method: 'GET'
    }
  )

  let responseBody: EthplorerAddressInfoResponse | null = null
  try {
    responseBody = await response.json()
  } catch (error) {}

  if (responseBody) {
    const usdBalance = responseBody.ETH.balance * responseBody.ETH.price.rate

    const eurToUsdExchangeRate = await dataSource
      .getRepository(ExchangeRate)
      .createQueryBuilder('exchangeRate')
      .where('exchangeRate.currencyCode = :currencyCode', { currencyCode: 'USD' })
      .orderBy('exchangeRate.date', 'DESC')
      .getOne()

    if (eurToUsdExchangeRate) {
      const eurBalance = usdBalance / eurToUsdExchangeRate.exchangeRate

      const exchangeRate = await dataSource
        .getRepository(ExchangeRate)
        .createQueryBuilder('exchangeRate')
        .where('exchangeRate.currencyCode = :currencyCode', { currencyCode })
        .getOne()

      if (exchangeRate) {
        return {
          currentBalance: eurBalance * exchangeRate.exchangeRate,
          walletTokenBalance: responseBody.ETH.balance
        }
      }
    }

    return {
      currentBalance: usdBalance,
      walletTokenBalance: responseBody.ETH.balance
    }
  }

  return {
    currentBalance: null,
    walletTokenBalance: null
  }
}

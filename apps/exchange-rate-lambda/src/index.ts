import { ExchangeRate, dataSource, getCoinPrice } from 'database'
import { startOfDay } from 'date-fns'
import { CurrencyCode } from 'shared-types'

type ExchangeRateResponse = {
  time_last_update_unix: number
  conversion_rates: Record<string, number>
}

export const handler = async () => {
  await dataSource.initialize()

  const response = await fetch(`${process.env.EXCHANGE_RATE_API_URL}/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`)

  let responseBody: ExchangeRateResponse | null = null
  try {
    responseBody = await response.json()
  } catch {}

  if (responseBody) {
    const exchangeRates = Object.keys(responseBody.conversion_rates)

    for (const exchangeRate of exchangeRates) {
      console.log(`Updating exchange rate for ${exchangeRate} to ${responseBody.conversion_rates[exchangeRate]}`)

      await dataSource
        .createQueryBuilder()
        .insert()
        .into(ExchangeRate)
        .values({
          date: startOfDay(responseBody.time_last_update_unix * 1000),
          currencyCode: exchangeRate as CurrencyCode,
          exchangeRate: responseBody.conversion_rates[exchangeRate]
        })
        .orIgnore()
        .execute()
    }
  }

  const btcPrice = await getCoinPrice('bitcoin')

  if (btcPrice) {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(ExchangeRate)
      .values({
        date: startOfDay(new Date()),
        currencyCode: CurrencyCode.BTC,
        exchangeRate: 1 / btcPrice
      })
      .orIgnore()
      .execute()
  }

  const ethPrice = await getCoinPrice('ethereum')

  if (ethPrice) {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(ExchangeRate)
      .values({
        date: startOfDay(new Date()),
        currencyCode: CurrencyCode.ETH,
        exchangeRate: 1 / ethPrice
      })
      .orIgnore()
      .execute()
  }

  console.log(`Exchange rate lambda complete`)
}

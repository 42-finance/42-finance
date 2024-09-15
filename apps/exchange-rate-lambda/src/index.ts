import { ExchangeRate, dataSource } from 'database'
import { startOfDay } from 'date-fns'
import { CurrencyCode } from 'shared-types'

type ExchangeRateResponse = {
  time_last_update_unix: number
  conversion_rates: Record<string, number>
}

export const handler = async () => {
  await dataSource.initialize()

  const response = await fetch(`${process.env.EXCHANGE_RATE_API_URL}/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`, {
    method: 'GET'
  })

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

  console.log(`Exchange rate lambda complete`)
}

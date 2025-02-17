type CoinResponse = {
  market_data: {
    current_price: {
      usd: number
    }
  }
}

export const getCoinPrice = async (coin: 'bitcoin' | 'ethereum') => {
  const response = await fetch(`${process.env.COINGECKO_API_URL}/coins/${coin}`, {
    headers: {
      'x-cg-demo-api-key': process.env.COINGECKO_API_KEY as string
    }
  })

  let responseBody: CoinResponse | null = null
  try {
    responseBody = await response.json()
  } catch {}

  return responseBody?.market_data?.current_price?.usd ?? null
}

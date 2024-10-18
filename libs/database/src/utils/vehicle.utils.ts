import { Boom } from '@hapi/boom'
import { VehicleCondition } from 'shared-types'

type MarketValueItem = {
  Condition: string
  'Trade-In': string
  'Private Party': string
  'Dealer Retail': string
}

type MarketValueData = {
  trim: string
  'market value': MarketValueItem[]
}

type VehicleValueResponse = {
  status: 'success' | 'error'
  data: {
    intro: {
      vin: string
    }
    basic: {
      make: string
      model: string
      year: string
      trim: string
      state: string
      mileage: string
    }
    market_value: {
      market_value_data: MarketValueData[]
    }
  }
}

export const getVehicleValue = async (
  vehicleVin: string,
  vehicleMileage: number | null,
  vehicleCondition: VehicleCondition | null
) => {
  let url = `${process.env.VEHICLE_DATABASES_API_URL}/market-value/v2/${vehicleVin}`

  if (vehicleMileage != null) {
    url += `?mileage=${vehicleMileage}`
  }

  console.log(url)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-AuthKey': process.env.VEHICLE_DATABASES_API_KEY as string
    }
  })

  if (response.ok) {
    const body: VehicleValueResponse = await response.json()

    console.log(JSON.stringify(body))

    let marketValue = body.data.market_value.market_value_data[0]['market value'].find(
      (m) => m.Condition === vehicleCondition
    )

    if (!marketValue) {
      marketValue = body.data.market_value.market_value_data[0]['market value'][0]
    }

    const value = Number(marketValue['Dealer Retail'].replace('$', '').replace(',', ''))

    return {
      make: body.data.basic.make,
      model: body.data.basic.model,
      year: Number(body.data.basic.year),
      trim: body.data.basic.trim,
      state: body.data.basic.state,
      mileage: body.data.basic.mileage,
      value
    }
  }

  throw new Boom('Unable to fetch vehicle value', { statusCode: 409 })
}

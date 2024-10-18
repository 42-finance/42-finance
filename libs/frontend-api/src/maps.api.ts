import { AutoCompleteResponse, PlaceDetailsResponse } from 'frontend-types'

import { config } from './config'
import { get } from './http'

const mapsApiUrl = 'https://maps.googleapis.com/maps/api/place'

export const autocompleteAddress = async (address: string, latitude?: number, longitude?: number) => {
  let url = `${mapsApiUrl}/autocomplete/json?key=${config.googleMapsApiKey}&input=${address}&types=address`
  if (latitude !== undefined && longitude !== undefined) {
    url += `&radius=50000&location=${latitude},${longitude}`
  }
  return get<AutoCompleteResponse>(url)
}

export const placeDetails = async (placeId: string) =>
  get<PlaceDetailsResponse>(`${mapsApiUrl}/details/json?key=${config.googleMapsApiKey}&place_id=${placeId}`)

import { Address, AddressComponent } from 'frontend-types'

export const getAddressFromComponents = (addressComponents: AddressComponent[]): Address => {
  const streetNumber = addressComponents.find((comp) => comp.types.includes('street_number'))
  const route = addressComponents.find((comp) => comp.types.includes('route'))
  const city = addressComponents.find((comp) => comp.types.includes('locality'))
  const territory = addressComponents.find((comp) => comp.types.includes('administrative_area_level_1'))
  const country = addressComponents.find((comp) => comp.types.includes('country'))
  const postalCode = addressComponents.find((comp) => comp.types.includes('postal_code'))
  return {
    address: `${streetNumber?.long_name ?? ''} ${route?.short_name ?? ''}`.trim(),
    city: city?.long_name ?? '',
    territory: territory?.long_name ?? '',
    country: country?.long_name ?? '',
    postalCode: postalCode?.long_name ?? ''
  }
}

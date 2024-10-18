import { AddressComponent } from './address-component.type'

export type PlaceDetailsResponse = {
  result: {
    address_components: AddressComponent[]
  }
}

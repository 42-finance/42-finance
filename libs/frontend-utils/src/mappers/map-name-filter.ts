import { NameFilter } from 'shared-types'

export const mapNameFilter = (nameFilter: NameFilter) => {
  switch (nameFilter) {
    case NameFilter.Contains:
      return 'Contains'
    case NameFilter.Matches:
      return 'Matches'
  }
}

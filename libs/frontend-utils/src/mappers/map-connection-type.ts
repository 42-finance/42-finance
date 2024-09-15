import { ConnectionType } from 'shared-types'

export const mapConnectionType = (connectionType: ConnectionType) => {
  switch (connectionType) {
    case ConnectionType.Finicity:
      return 'Finicity'
    case ConnectionType.Mx:
      return 'MX'
    case ConnectionType.Plaid:
      return 'Plaid'
  }
}

import { AntDesign, Feather, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { Account } from 'frontend-types'
import { Avatar, useTheme } from 'react-native-paper'
import { AccountSubType, ConnectionType } from 'shared-types'

type Props = {
  account: Account
}

export const AccountIcon: React.FC<Props> = ({ account }) => {
  const { colors } = useTheme()

  const accountIcon = (type: AccountSubType) => {
    switch (type) {
      case AccountSubType.Checking:
      case AccountSubType.CreditCard:
        return <MaterialIcons name="account-balance" size={20} color={colors.onSurface} style={{ marginLeft: 2 }} />
      case AccountSubType.Vehicle:
        return <FontAwesome5 name="car" size={20} color={colors.onSurface} />
      case AccountSubType.CryptoExchange:
        return <FontAwesome5 name="bitcoin" size={20} color={colors.onSurface} />
      case AccountSubType.Property:
        return <FontAwesome name="home" size={20} color={colors.onSurface} />
      default:
        return <AntDesign name="arrowup" size={20} color={colors.onSurface} />
    }
  }

  if (account.connection?.needsTokenRefresh) {
    return (
      <Avatar.Icon
        size={36}
        icon={() => <Feather name="alert-triangle" size={20} color="#C00" />}
        style={{
          marginEnd: 15,
          backgroundColor: colors.background,
          alignSelf: 'center'
        }}
      />
    )
  }

  if (account.connection?.type === ConnectionType.Plaid && account.connection.institutionLogo) {
    return (
      <Avatar.Image
        size={36}
        source={{ uri: `data:image/png;base64,${account.connection.institutionLogo}` }}
        style={{ marginEnd: 15 }}
      />
    )
  }

  if (account.connection?.type === ConnectionType.Mx && account.connection.institutionLogo) {
    return <Avatar.Image size={36} source={{ uri: account.connection.institutionLogo }} style={{ marginEnd: 15 }} />
  }

  return (
    <Avatar.Icon
      size={36}
      icon={() => accountIcon(account.subType)}
      style={{
        marginEnd: 15,
        backgroundColor: colors.background,
        alignSelf: 'center'
      }}
    />
  )
}

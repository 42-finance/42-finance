import { Entypo } from '@expo/vector-icons'
import { formatAccountName, formatDollarsSigned } from 'frontend-utils'
import { TouchableOpacity, View } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'

import { Account } from '../../../../../libs/frontend-types/src/account.type'
import { AccountIcon } from './AccountIcon'

type Props = {
  account: Account
  onDelete: (account: Account) => void
  showBalance?: boolean
}

export const AccountFilterSelection = ({ account, onDelete, showBalance }: Props) => {
  const { colors } = useTheme()

  return (
    <>
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          padding: 15
        }}
      >
        <AccountIcon account={account} />
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" numberOfLines={1}>
            {formatAccountName(account)}
          </Text>
          {showBalance && (
            <Text variant="titleMedium" numberOfLines={1}>
              {formatDollarsSigned(account.convertedBalance)}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => onDelete(account)}>
          <Entypo name="cross" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </>
  )
}

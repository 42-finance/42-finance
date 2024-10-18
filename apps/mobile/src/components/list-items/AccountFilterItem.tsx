import { FontAwesome5 } from '@expo/vector-icons'
import { formatAccountName } from 'frontend-utils'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { Account } from '../../../../../libs/frontend-types/src/account.type'
import { AccountIcon } from '../account/AccountIcon'

type Props = {
  account: Account
  onSelected: (account: Account) => void
  index?: number
  isSelecting?: boolean
  isSelected?: boolean
}

export const AccountFilterItem = ({ account, onSelected, index, isSelecting = true, isSelected }: Props) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(account)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: colors.elevation.level2
      }}
    >
      <>
        {index != null && index > 0 && <Divider />}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            padding: 15
          }}
        >
          {isSelecting && (
            <>
              {isSelected ? (
                <Avatar.Icon
                  size={24}
                  icon={() => <FontAwesome5 name="check" size={12} color="white" />}
                  style={{ marginEnd: 15, backgroundColor: colors.primary }}
                />
              ) : (
                <Avatar.Icon size={24} icon={() => null} style={{ marginEnd: 15, backgroundColor: colors.outline }} />
              )}
            </>
          )}
          <AccountIcon account={account} />
          <Text variant="titleMedium" numberOfLines={1}>
            {formatAccountName(account)}
          </Text>
        </View>
      </>
    </TouchableOpacity>
  )
}

import { FontAwesome6 } from '@expo/vector-icons'
import _ from 'lodash'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { Merchant } from '../../../../../libs/frontend-types/src/merchant.type'

type Props = {
  merchant: Merchant
  onSelected: (merchant: Merchant) => void
  index?: number
}

export const MerchantItem = ({ merchant, onSelected, index }: Props) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(merchant)
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
            backgroundColor: 'transparent',
            alignItems: 'center',
            padding: 15
          }}
        >
          {_.isEmpty(merchant.icon) ? (
            <Avatar.Icon
              size={36}
              icon={() => <FontAwesome6 name="building" size={20} color={colors.outline} />}
              style={{ marginEnd: 15, backgroundColor: colors.surface }}
            />
          ) : (
            <Avatar.Image size={36} source={{ uri: merchant.icon }} style={{ marginEnd: 15 }} />
          )}
          <View>
            <Text variant="titleMedium" numberOfLines={1}>
              {merchant.name}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.outline }}>
              {merchant.transactionCount} transactions
            </Text>
          </View>
        </View>
      </>
    </TouchableOpacity>
  )
}

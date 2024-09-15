import { Entypo, FontAwesome6 } from '@expo/vector-icons'
import _ from 'lodash'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { Merchant } from '../../../../../libs/frontend-types/src/merchant.type'

type Props = {
  merchant: Merchant
  onDelete: (merchant: Merchant) => void
}

export const MerchantFilterSelection = ({ merchant, onDelete }: Props) => {
  const { colors } = useTheme()

  return (
    <>
      <Divider />
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
        <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>
          {merchant.name}
        </Text>
        <TouchableOpacity onPress={() => onDelete(merchant)}>
          <Entypo name="cross" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </>
  )
}

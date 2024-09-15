import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import _ from 'lodash'
import { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { Merchant } from '../../../../../libs/frontend-types/src/merchant.type'

type Props = {
  merchant: Merchant
  onSelected: (merchant: Merchant) => void
  isSelected?: boolean
  isSelecting?: boolean
}

const MFI = ({ merchant, onSelected, isSelected, isSelecting = true }: Props) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(merchant)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch'
      }}
    >
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
        {_.isEmpty(merchant.icon) ? (
          <Avatar.Icon
            size={36}
            icon={() => <FontAwesome6 name="building" size={20} color={colors.outline} />}
            style={{ marginEnd: 15, backgroundColor: colors.surface }}
          />
        ) : (
          <Avatar.Image size={36} source={{ uri: merchant.icon }} style={{ marginEnd: 15 }} />
        )}
        <Text variant="titleMedium" numberOfLines={1}>
          {merchant.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export const MerchantFilterItem = memo(MFI)

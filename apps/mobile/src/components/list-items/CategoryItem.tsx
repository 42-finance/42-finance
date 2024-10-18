import { Entypo, FontAwesome5 } from '@expo/vector-icons'
import { memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar, Divider, Text, useTheme } from 'react-native-paper'

import { Category } from '../../../../../libs/frontend-types/src/category.type'
import { View } from '../common/View'

type Props = {
  category: Category
  onSelected: (category: Category) => void
  isSelecting?: boolean
  isSelected?: boolean
  viewStyle?: object
}

const CI = ({ category, onSelected, isSelecting, isSelected, viewStyle }: Props) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(category)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: category.mapToCategoryId ? colors.elevation.level5 : colors.elevation.level2
      }}
    >
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          padding: 15,
          opacity: category.mapToCategoryId ? 0.5 : 1,
          ...viewStyle
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
        <Text variant="titleMedium" style={{ marginEnd: 8 }}>
          {category.icon}
        </Text>
        <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>
          {category.name}
        </Text>
        {category.mapToCategoryId && <Entypo name="eye-with-line" size={24} color={colors.onSurface} />}
      </View>
    </TouchableOpacity>
  )
}

export const CategoryItem = memo(CI)

import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'

import { Category } from '../../../../../libs/frontend-types/src/category.type'
import { View } from '../common/View'

type Props = {
  category: Category
  onDelete: (category: Category) => void
}

export const CategoryFilterSelection = ({ category, onDelete }: Props) => {
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
        <Text variant="titleMedium" numberOfLines={1} style={{ flex: 1 }}>
          {category.icon} {category.name}
        </Text>
        <TouchableOpacity onPress={() => onDelete(category)}>
          <Entypo name="cross" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </>
  )
}

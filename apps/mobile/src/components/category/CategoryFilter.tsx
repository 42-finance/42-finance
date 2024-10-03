import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getCategories } from 'frontend-api'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { View } from '../common/View'
import { CategoryFilterSelection } from './CategoryFilterSelection'

type Props = {
  categoryIds: number[]
  onDelete: (categoryId: number) => void
}

export const CategoryFilter: React.FC<Props> = ({ categoryIds, onDelete }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()

  const { data: categories = [] } = useQuery({
    queryKey: [ApiQuery.Categories],
    queryFn: async () => {
      const res = await getCategories()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const filteredCategories = useMemo(
    () => categories.filter((a) => categoryIds.includes(a.id)),
    [categories, categoryIds]
  )

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          Categories
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectCategory', {
              categoryIds,
              eventName: 'onCategoryFilterSelected',
              multiple: true
            })
          }
        >
          <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
      {filteredCategories.map((category) => (
        <CategoryFilterSelection key={category.id} category={category} onDelete={() => onDelete(category.id)} />
      ))}
    </>
  )
}

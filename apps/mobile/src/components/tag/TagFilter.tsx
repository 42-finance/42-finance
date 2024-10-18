import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTags } from 'frontend-api'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { View } from '../common/View'
import { TagFilterSelection } from './TagFilterSelection'

type Props = {
  tagIds: number[]
  onDelete: (categoryId: number) => void
}

export const TagFilter: React.FC<Props> = ({ tagIds, onDelete }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()

  const { data: tags = [] } = useQuery({
    queryKey: [ApiQuery.Tags],
    queryFn: async () => {
      const res = await getTags()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const filteredTags = useMemo(() => tags.filter((a) => tagIds.includes(a.id)), [tags, tagIds])

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, marginVertical: 10 }}>
        <Text variant="bodyMedium" style={{ flex: 1 }}>
          Tags
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectTag', {
              tagIds,
              eventName: 'onTagFilterSelected'
            })
          }
        >
          <AntDesign name="pluscircleo" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
      {filteredTags.map((tag) => (
        <TagFilterSelection key={tag.id} tag={tag} onDelete={() => onDelete(tag.id)} />
      ))}
    </>
  )
}

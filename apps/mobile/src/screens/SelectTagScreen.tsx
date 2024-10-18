import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTags } from 'frontend-api'
import { Tag } from 'frontend-types'
import { eventEmitter } from 'frontend-utils'
import { useCallback, useState } from 'react'
import { FlatList } from 'react-native'
import { ProgressBar, Searchbar } from 'react-native-paper'

import { View } from '../components/common/View'
import { TagItem } from '../components/list-items/TagItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SelectTagScreen = ({ route }: RootStackScreenProps<'SelectTag'>) => {
  const { tagIds, eventName } = route.params

  const [search, setSearch] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(tagIds)

  const { data: tags = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Tags, search],
    queryFn: async () => {
      const res = await getTags({ search })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const onSelected = useCallback(
    (tag: Tag) => {
      eventEmitter.emit(eventName, tag)
    },
    [eventName]
  )

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <Searchbar placeholder="Search" onChangeText={setSearch} value={search} style={{ margin: 10 }} />
      <FlatList
        data={tags}
        renderItem={({ item }) => (
          <TagItem
            key={item.id}
            tag={item}
            onSelected={() => {
              setSelectedTagIds((oldTagIds) =>
                oldTagIds.find((c) => c === item.id) ? oldTagIds.filter((c) => c !== item.id) : [...oldTagIds, item.id]
              )
              onSelected(item)
            }}
            isSelecting
            isSelected={selectedTagIds.find((c) => c === item.id) != null}
          />
        )}
      />
    </View>
  )
}

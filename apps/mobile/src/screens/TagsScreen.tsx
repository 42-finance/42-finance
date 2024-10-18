import { FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTags } from 'frontend-api'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { ProgressBar, Searchbar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { TagItem } from '../components/list-items/TagItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const TagsScreen = ({ navigation }: RootStackScreenProps<'Tags'>) => {
  const { colors } = useTheme()

  const [search, setSearch] = useState('')

  const { data: rules = [], isFetching: fetching } = useQuery({
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddTag')}>
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearch}
        value={search}
        style={{ margin: 10, marginTop: 8, backgroundColor: colors.elevation.level2 }}
      />
      <FlatList
        data={rules}
        renderItem={({ item, index }) => (
          <TagItem
            key={item.id}
            tag={item}
            onSelected={() => {
              navigation.navigate('EditTag', { tagId: item.id })
            }}
            index={index}
          />
        )}
      />
    </View>
  )
}

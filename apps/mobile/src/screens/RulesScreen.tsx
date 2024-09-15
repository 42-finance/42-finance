import { FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getRules } from 'frontend-api'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { ProgressBar, Searchbar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { RuleItem } from '../components/list-items/RuleItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const RulesScreen = ({ navigation }: RootStackScreenProps<'Rules'>) => {
  const { colors } = useTheme()

  const [search, setSearch] = useState('')

  const { data: rules = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Rules, search],
    queryFn: async () => {
      const res = await getRules({ search })
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
        <TouchableOpacity onPress={() => navigation.navigate('AddRule', {})}>
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
          <RuleItem
            key={item.id}
            rule={item}
            onSelected={() => {
              navigation.navigate('EditRule', { ruleId: item.id })
            }}
            index={index}
          />
        )}
      />
    </View>
  )
}

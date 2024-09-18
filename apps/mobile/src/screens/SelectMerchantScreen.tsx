import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getMerchants } from 'frontend-api'
import { eventEmitter } from 'frontend-utils'
import * as React from 'react'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { ProgressBar, Searchbar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { MerchantItem } from '../components/list-items/MerchantItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SelectMerchantScreen = ({ navigation, route }: RootStackScreenProps<'SelectMerchant'>) => {
  const { merchantIds, eventName, multiple } = route.params

  const { colors } = useTheme()

  const [search, setSearch] = useState('')
  const [selectedMerchantIds, setSelectedMerchantIds] = useState<number[]>(merchantIds)

  const { data: merchants = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Merchants, search],
    queryFn: async () => {
      const res = await getMerchants({ search })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

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
        data={merchants}
        renderItem={({ item }) => (
          <MerchantItem
            key={item.id}
            merchant={item}
            onSelected={() => {
              setSelectedMerchantIds((oldMerchantIds) =>
                oldMerchantIds.find((c) => c === item.id)
                  ? oldMerchantIds.filter((c) => c !== item.id)
                  : [...oldMerchantIds, item.id]
              )
              eventEmitter.emit(eventName, item)
              if (!multiple) {
                navigation.pop()
              }
            }}
            isSelecting={multiple}
            isSelected={selectedMerchantIds.find((c) => c === item.id) != null}
          />
        )}
      />
    </View>
  )
}

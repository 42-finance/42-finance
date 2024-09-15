import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getMerchants } from 'frontend-api'
import { eventEmitter } from 'frontend-utils'
import * as React from 'react'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { View } from '../components/common/View'
import { MerchantFilterItem } from '../components/list-items/MerchantFilterItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SelectMerchantScreen = ({ navigation, route }: RootStackScreenProps<'SelectMerchant'>) => {
  const { merchantIds, eventName, multiple } = route.params

  const [selectedMerchantIds, setSelectedMerchantIds] = useState<number[]>(merchantIds)

  const { data: merchants = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Merchants],
    queryFn: async () => {
      const res = await getMerchants({})
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
      <FlatList
        data={merchants}
        renderItem={({ item }) => (
          <MerchantFilterItem
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

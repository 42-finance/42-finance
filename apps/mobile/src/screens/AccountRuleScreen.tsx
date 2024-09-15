import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import { eventEmitter } from 'frontend-utils'
import * as React from 'react'
import { FlatList } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { View } from '../components/common/View'
import { AccountFilterItem } from '../components/list-items/AccountFilterItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AccountRuleScreen = ({ navigation }: RootStackScreenProps<'AccountRule'>) => {
  const { data: allAccounts = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Accounts],
    queryFn: async () => {
      const res = await getAccounts()
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
        data={allAccounts}
        renderItem={({ item, index }) => (
          <AccountFilterItem
            key={item.id}
            account={item}
            onSelected={() => {
              eventEmitter.emit('onAccountSelected', item)
              navigation.pop()
            }}
            index={index}
            isSelecting={false}
          />
        )}
      />
    </View>
  )
}

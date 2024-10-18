import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccounts } from 'frontend-api'
import { eventEmitter } from 'frontend-utils'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { FlatList } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { View } from '../components/common/View'
import { AccountFilterItem } from '../components/list-items/AccountFilterItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SelectAccountScreen = ({ navigation, route }: RootStackScreenProps<'SelectAccount'>) => {
  const { accountIds, eventName, multiple, accountTypes } = route.params

  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(accountIds)

  const { data: accounts = [], isFetching: fetching } = useQuery({
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

  const filteredAccounts = useMemo(
    () => (accountTypes ? accounts.filter((a) => accountTypes.includes(a.type)) : accounts),
    [accountTypes, accounts]
  )

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <FlatList
        data={filteredAccounts}
        renderItem={({ item }) => (
          <AccountFilterItem
            key={item.id}
            account={item}
            onSelected={() => {
              setSelectedAccountIds((oldAccountIds) =>
                oldAccountIds.find((c) => c === item.id)
                  ? oldAccountIds.filter((c) => c !== item.id)
                  : [...oldAccountIds, item.id]
              )
              eventEmitter.emit(eventName, item)
              if (!multiple) {
                navigation.pop()
              }
            }}
            isSelecting={multiple}
            isSelected={selectedAccountIds.find((c) => c === item.id) != null}
          />
        )}
      />
    </View>
  )
}

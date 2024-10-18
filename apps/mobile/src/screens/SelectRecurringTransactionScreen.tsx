import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getRecurringTransactions } from 'frontend-api'
import { eventEmitter } from 'frontend-utils'
import * as React from 'react'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { View } from '../components/common/View'
import { RecurringTransactionItem } from '../components/list-items/RecurringTransactionItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const SelectRecurringTransactionScreen = ({
  navigation,
  route
}: RootStackScreenProps<'SelectRecurringTransaction'>) => {
  const { recurringTransactionIds, eventName, multiple } = route.params

  const [selectedRecurringTransactionIds, setSelectedRecurringTransactionIds] =
    useState<number[]>(recurringTransactionIds)

  const { data: recurringTransactions = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.RecurringTransactions],
    queryFn: async () => {
      const res = await getRecurringTransactions()
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
        data={recurringTransactions}
        renderItem={({ item }) => (
          <RecurringTransactionItem
            key={item.id}
            transaction={item}
            onSelected={() => {
              setSelectedRecurringTransactionIds((oldRecurringTransactionIds) =>
                oldRecurringTransactionIds.find((c) => c === item.id)
                  ? oldRecurringTransactionIds.filter((c) => c !== item.id)
                  : [...oldRecurringTransactionIds, item.id]
              )
              eventEmitter.emit(eventName, item)
              if (!multiple) {
                navigation.pop()
              }
            }}
            isSelecting={multiple}
            isSelected={selectedRecurringTransactionIds.find((c) => c === item.id) != null}
          />
        )}
      />
    </View>
  )
}

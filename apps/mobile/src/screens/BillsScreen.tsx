import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBills } from 'frontend-api'
import * as React from 'react'
import { useState } from 'react'
import { FlatList } from 'react-native'
import { ProgressBar, Searchbar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { BillItem } from '../components/list-items/BillItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const BillsScreen = ({ navigation }: RootStackScreenProps<'Bills'>) => {
  const { colors } = useTheme()

  const [search, setSearch] = useState('')

  const { data: bills = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Bills, search],
    queryFn: async () => {
      const res = await getBills({ search })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <ProgressBar indeterminate visible={fetching} />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearch}
        value={search}
        style={{ margin: 10, marginTop: 8, backgroundColor: colors.elevation.level2 }}
      />
      <FlatList
        data={bills}
        renderItem={({ item }) => (
          <BillItem
            key={item.id}
            bill={item}
            onSelected={() => {
              navigation.navigate('Bill', { billId: item.id })
            }}
            backgroundColor={colors.elevation.level2}
          />
        )}
      />
    </View>
  )
}

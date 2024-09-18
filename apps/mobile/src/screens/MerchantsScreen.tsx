import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getMerchants } from 'frontend-api'
import * as React from 'react'
import { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { ProgressBar, Searchbar, useTheme } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { View } from '../components/common/View'
import { MerchantItem } from '../components/list-items/MerchantItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const MerchantsScreen = ({ navigation }: RootStackScreenProps<'Merchants'>) => {
  const { colors } = useTheme()

  const [search, setSearch] = useState('')

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent'
    }
  })

  return (
    <View style={styles.container}>
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
              navigation.navigate('Merchant', { merchantId: item.id, dateFilter: ReportDateFilter.Monthly })
            }}
          />
        )}
      />
    </View>
  )
}

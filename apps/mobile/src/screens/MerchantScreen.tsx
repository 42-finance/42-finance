import { Entypo, Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getMerchant, getTransactions } from 'frontend-api'
import { mapReportDateFilter } from 'frontend-utils'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { CategoryReport } from '../components/category/CategoryReport'
import { View } from '../components/common/View'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const MerchantScreen = ({ navigation, route }: RootStackScreenProps<'Merchant'>) => {
  const { merchantId, date, dateFilter: dateFilterParam } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()

  const [dateFilter, setDateFilter] = useState(dateFilterParam)

  const { data: merchant } = useQuery({
    queryKey: [ApiQuery.Merchant, merchantId],
    queryFn: async () => {
      const res = await getMerchant(merchantId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.MerchantTransactions, merchantId],
    queryFn: async () => {
      const res = await getTransactions({ merchantIds: [merchantId] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  useEffect(() => {
    navigation.setOptions({
      title: merchant ? merchant.name : 'Loading...',
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() =>
              showActionSheet(
                Object.values(ReportDateFilter).map((d) => ({
                  label: mapReportDateFilter(d),
                  onSelected: () => setDateFilter(d)
                }))
              )
            }
          >
            <Entypo name="calendar" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showActionSheet([
                {
                  label: 'Edit merchant',
                  onSelected: () => navigation.navigate('EditMerchant', { merchantId })
                }
              ])
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
      )
    })
  }, [colors.onSurface, merchant, merchantId, navigation, showActionSheet])

  if (!merchant) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetchingTransactions} />
      <CategoryReport
        transactions={transactions}
        date={date ? new Date(date) : null}
        type={transactions[0]?.category.group.type}
        dateFilter={dateFilter}
      />
    </View>
  )
}

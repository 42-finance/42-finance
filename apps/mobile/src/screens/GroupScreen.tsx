import { Entypo } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBudgets, getGroup, getTransactions } from 'frontend-api'
import { mapReportDateFilter } from 'frontend-utils'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { CategoryReport } from '../components/category/CategoryReport'
import { View } from '../components/common/View'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const GroupScreen = ({ navigation, route }: RootStackScreenProps<'Group'>) => {
  const { groupId, date, dateFilter: dateFilterParam } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()

  const [dateFilter, setDateFilter] = useState(dateFilterParam)

  const { data: group } = useQuery({
    queryKey: [ApiQuery.Group, groupId],
    queryFn: async () => {
      const res = await getGroup(groupId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.GroupTransactions, groupId],
    queryFn: async () => {
      const res = await getTransactions({ groupIds: [groupId] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const { data: budgets = [] } = useQuery({
    queryKey: [ApiQuery.Budgets],
    queryFn: async () => {
      const res = await getBudgets()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const groupBudgets = useMemo(() => budgets.filter((b) => b.category.groupId === groupId), [budgets, groupId])

  const budgetAmount = useMemo(() => _.sumBy(groupBudgets, 'amount'), [groupBudgets])

  useEffect(() => {
    navigation.setOptions({
      title: group ? group.name : 'Loading...',
      headerRight: () => (
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
      )
    })
  }, [group, navigation])

  if (!group) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetchingTransactions} />
      <CategoryReport
        transactions={transactions}
        date={date ? new Date(date) : null}
        budgetAmount={budgetAmount}
        type={group.type}
        dateFilter={dateFilter}
      />
    </View>
  )
}

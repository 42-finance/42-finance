import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getBudgets, getGroup, getTransactions } from 'frontend-api'
import { dateToUtc } from 'frontend-utils'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { ProgressBar } from 'react-native-paper'

import { CategoryReport } from '../components/category/CategoryReport'
import { View } from '../components/common/View'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const GroupScreen = ({ navigation, route }: RootStackScreenProps<'Group'>) => {
  const { groupId, date } = route.params

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
      const today = dateToUtc(startOfDay(new Date()))
      const startDate = dateToUtc(subMonths(startOfMonth(today), 5))
      const endDate = dateToUtc(endOfMonth(today))
      const res = await getTransactions({ startDate, endDate, groupIds: [groupId] })
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
      title: group ? group.name : 'Loading...'
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
      />
    </View>
  )
}

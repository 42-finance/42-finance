import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getBudgets, getGroup, getTransactions } from 'frontend-api'
import { dateToUtc } from 'frontend-utils'
import _ from 'lodash'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryParam } from 'use-query-params'

import { CategoryReport } from '../components/category/category-report'
import { Card } from '../components/common/card/card'
import { ActivityIndicator } from '../components/common/loader/activity-indicator'

export const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [date] = useQueryParam<string>('date')

  const parsedId = useMemo(() => Number(id), [id])
  const parsedDate = useMemo(() => (date ? new Date(date) : null), [date])

  const { data: group, isFetching } = useQuery({
    queryKey: [ApiQuery.Group, parsedId],
    queryFn: async () => {
      const res = await getGroup(parsedId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.GroupTransactions, parsedId],
    queryFn: async () => {
      const today = dateToUtc(startOfDay(new Date()))
      const startDate = dateToUtc(subMonths(startOfMonth(today), 5))
      const endDate = dateToUtc(endOfMonth(today))
      const res = await getTransactions({ startDate, endDate, groupIds: [parsedId] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  const { data: budgets = [], isFetching: fetchingBudgets } = useQuery({
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

  const groupBudgets = useMemo(() => budgets.filter((b) => b.category.groupId === parsedId), [budgets, parsedId])

  const budgetAmount = useMemo(() => _.sumBy(groupBudgets, 'amount'), [groupBudgets])

  if (!group) {
    return (
      <div className="pt-12">
        <ActivityIndicator />
      </div>
    )
  }

  return (
    <Card title={group.name} className="m-4">
      <CategoryReport transactions={transactions} date={parsedDate} budgetAmount={budgetAmount} type={group.type} />
    </Card>
  )
}

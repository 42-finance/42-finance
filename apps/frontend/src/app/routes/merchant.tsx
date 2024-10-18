import { useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfDay, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getMerchant, getTransactions } from 'frontend-api'
import { dateToUtc } from 'frontend-utils'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQueryParam } from 'use-query-params'

import { CategoryReport } from '../components/category/category-report'
import { Card } from '../components/common/card/card'
import { ActivityIndicator } from '../components/common/loader/activity-indicator'

export const MerchantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [date] = useQueryParam<string>('date')

  const parsedId = useMemo(() => Number(id), [id])
  const parsedDate = useMemo(() => (date ? new Date(date) : null), [date])

  const { data: merchant, isFetching } = useQuery({
    queryKey: [ApiQuery.Merchant, parsedId],
    queryFn: async () => {
      const res = await getMerchant(parsedId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.MerchantTransactions, parsedId],
    queryFn: async () => {
      const today = dateToUtc(startOfDay(new Date()))
      const startDate = dateToUtc(subMonths(startOfMonth(today), 5))
      const endDate = dateToUtc(endOfMonth(today))
      const res = await getTransactions({ startDate, endDate, merchantIds: [parsedId] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    }
  })

  if (!merchant) {
    return (
      <div className="pt-12">
        <ActivityIndicator />
      </div>
    )
  }

  return (
    <Card title={merchant.name} className="m-4">
      <CategoryReport transactions={transactions} date={parsedDate} type={transactions[0]?.category.group.type} />
    </Card>
  )
}

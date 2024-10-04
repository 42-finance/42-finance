import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfDay, endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { dateToUtc, getDailySpending } from 'frontend-utils'
import { useMemo } from 'react'

import { Card } from '../common/card/card'
import { SpendingGraph } from '../common/chart/spending-graph'

export const SpendingWidget: React.FC = () => {
  const today = new Date()
  const startOflastMonth = dateToUtc(startOfMonth(subMonths(today, 1)))
  const endOflastMonth = dateToUtc(endOfMonth(subMonths(today, 1)))
  const startOfThisMonth = dateToUtc(startOfMonth(today))

  const { data: transactions = [], isFetching } = useQuery({
    queryKey: [ApiQuery.SpendingTransactions],
    queryFn: async () => {
      const res = await getTransactions({ startDate: startOflastMonth })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const lastMonthTransactions = useMemo(
    () => transactions.filter((t) => t.date.getUTCMonth() === startOflastMonth.getUTCMonth()),
    [transactions]
  )

  const thisMonthTransactions = useMemo(
    () => transactions.filter((t) => t.date.getUTCMonth() === startOfThisMonth.getUTCMonth()),
    [transactions]
  )

  const lastMonthSpending = useMemo(
    () => getDailySpending(lastMonthTransactions, startOflastMonth, endOflastMonth),
    [lastMonthTransactions]
  )

  const thisMonthSpending = useMemo(
    () => getDailySpending(thisMonthTransactions, startOfThisMonth, dateToUtc(endOfDay(today))),
    [thisMonthTransactions]
  )

  const lastMonthSpendingData = useMemo(() => {
    const data = lastMonthSpending.map(({ value }) => Math.max(0, value))
    if (data.length === 1) {
      data.push(data[0])
    }
    return data.map((value, index) => ({ y: value, x: index }))
  }, [lastMonthSpending])

  const thisMonthSpendingData = useMemo(() => {
    const data = thisMonthSpending.map(({ value }) => Math.max(0, value))
    if (data.length === 1) {
      data.push(data[0])
    }
    return data.map((value, index) => ({ y: value, x: index }))
  }, [thisMonthSpending])

  return (
    <Card title="Spending">
      <div>
        <SpendingGraph
          lastMonthData={lastMonthSpendingData}
          thisMonthData={thisMonthSpendingData}
          isLoading={isFetching}
        />
      </div>
      <div className="flex items-center justify-center mb-4">
        <div className="mr-2 bg-[#555] h-[3px] w-[20px] md:w-[30px]" />
        <div className="text-xs md:text-sm text-outline font-bold">SPENDING LAST MONTH</div>
        <div className="ml-5 mr-2 bg-primary h-[3px] w-[20px] md:w-[30px]" />
        <div className="text-xs md:text-sm text-outline font-bold">SPENDING THIS MONTH</div>
      </div>
    </Card>
  )
}

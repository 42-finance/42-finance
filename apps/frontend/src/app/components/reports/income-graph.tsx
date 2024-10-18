import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { dateToUtc, formatDateInUtc, formatDollarsSigned, groupTransactionsByMonth } from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryType } from 'shared-types'

import { Card } from '../common/card/card'
import { Statistic } from '../common/statistic'
import { MonthlyBarChart } from './monthly-bar-chart'

export const IncomeGraph = () => {
  const navigate = useNavigate()

  const thisMonth = useMemo(() => dateToUtc(startOfMonth(new Date())), [])
  const lastMonth = useMemo(() => dateToUtc(startOfMonth(subMonths(new Date(), 1))), [])

  const { data: transactions = [], isFetching } = useQuery({
    queryKey: [ApiQuery.CashFlowTransactions],
    queryFn: async () => {
      const res = await getTransactions()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const monthTransactions = useMemo(() => groupTransactionsByMonth(transactions), [transactions])

  const color = '#19d2a5'

  const monthlyData = useMemo(
    () =>
      monthTransactions.map(({ key, transactions }) => ({
        value: Math.max(
          0,
          -_.sumBy(
            transactions.filter((t) => t.category.group.type === CategoryType.Income),
            'amount'
          )
        ),
        color,
        label: formatDateInUtc(key, 'MMMM').toUpperCase(),
        date: key
      })),
    [monthTransactions]
  )

  const incomeTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.category.group.type === CategoryType.Income)
        .map((t) => ({ ...t, amount: -t.amount })),
    [transactions]
  )

  const thisMonthTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.date.getUTCMonth() === thisMonth.getUTCMonth())
        .filter((t) => t.category.group.type === CategoryType.Income)
        .map((t) => ({ ...t, amount: -t.amount })),
    [transactions, thisMonth]
  )

  const lastMonthTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.date.getUTCMonth() === lastMonth.getUTCMonth())
        .filter((t) => t.category.group.type === CategoryType.Income)
        .map((t) => ({ ...t, amount: -t.amount })),
    [transactions, lastMonth]
  )

  const totalValue = useMemo(() => _.sumBy(incomeTransactions, 'amount'), [incomeTransactions])

  const thisMonthValue = useMemo(() => _.sumBy(thisMonthTransactions, 'amount'), [thisMonthTransactions])

  const lastMonthValue = useMemo(() => _.sumBy(lastMonthTransactions, 'amount'), [lastMonthTransactions])

  const monthlyAverage = useMemo(() => {
    if (monthTransactions.length === 0) return 0
    return totalValue / monthTransactions.length
  }, [totalValue, monthTransactions.length])

  return (
    <>
      <div className="my-5" style={{ alignSelf: 'center' }}>
        <MonthlyBarChart
          data={monthlyData}
          onSelected={(date: Date) => navigate(`/reports/${formatDateInUtc(date, 'yyyy-MM-dd')}`)}
          isLoading={isFetching}
        />
      </div>
      <div className="border-t" />
      <div className="grid gap-3 mt-3 md:m-3 md:grid-cols-3">
        <Card className="p-4 flex justify-center">
          <Statistic
            title="This Month"
            value={formatDollarsSigned(thisMonthValue)}
            color={thisMonthValue < 0 ? 'text-expense' : 'text-income'}
          />
        </Card>
        <Card className="p-4 flex justify-center">
          <Statistic
            title="Last Month"
            value={formatDollarsSigned(lastMonthValue)}
            color={lastMonthValue < 0 ? 'text-expense' : 'text-income'}
          />
        </Card>
        <Card className="p-4 flex justify-center">
          <Statistic
            title="6 month average"
            value={formatDollarsSigned(monthlyAverage)}
            color={monthlyAverage < 0 ? 'text-expense' : 'text-income'}
          />
        </Card>
      </div>
    </>
  )
}

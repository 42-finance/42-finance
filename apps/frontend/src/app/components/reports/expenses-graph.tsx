import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { dateToUtc, formatDateInUtc, formatDollarsSigned, groupTransactionsByMonth } from 'frontend-utils'
import _ from 'lodash'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryType } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { Card } from '../common/card/card'
import { Statistic } from '../common/statistic'
import { MonthlyBarChart } from './monthly-bar-chart'

export const ExpensesGraph = () => {
  const navigate = useNavigate()
  const { currencyCode } = useUserTokenContext()

  const thisMonth = useMemo(() => dateToUtc(startOfMonth(new Date())), [])
  const lastMonth = useMemo(() => dateToUtc(startOfMonth(subMonths(new Date(), 1))), [])

  const { data: transactions = [], isFetching } = useQuery({
    queryKey: [ApiQuery.CashFlowTransactions],
    queryFn: async () => {
      const startDate = dateToUtc(subMonths(startOfMonth(new Date()), 5))
      const endDate = dateToUtc(endOfMonth(new Date()))
      const res = await getTransactions({ startDate, endDate })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const expenseTransactions = useMemo(
    () => transactions.filter((t) => t.category.group.type === CategoryType.Expense),
    [transactions]
  )

  const monthTransactions = useMemo(() => groupTransactionsByMonth(expenseTransactions), [expenseTransactions])

  const color = '#f0648c'

  const monthlyData = useMemo(
    () =>
      monthTransactions.map(({ key, transactions }) => ({
        value: Math.max(0, _.sumBy(transactions, 'amount')),
        color,
        label: formatDateInUtc(key, 'MMM').toUpperCase(),
        date: key
      })),
    [monthTransactions]
  )

  const thisMonthTransactions = useMemo(
    () => expenseTransactions.filter((t) => t.date.getUTCMonth() === thisMonth.getUTCMonth()),
    [expenseTransactions, thisMonth]
  )

  const lastMonthTransactions = useMemo(
    () => expenseTransactions.filter((t) => t.date.getUTCMonth() === lastMonth.getUTCMonth()),
    [expenseTransactions, lastMonth]
  )

  const totalValue = useMemo(() => _.sumBy(expenseTransactions, 'amount'), [expenseTransactions])

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
            value={formatDollarsSigned(thisMonthValue, currencyCode)}
            color={thisMonthValue < 0 ? 'text-expense' : 'text-income'}
          />
        </Card>
        <Card className="p-4 flex justify-center">
          <Statistic
            title="Last Month"
            value={formatDollarsSigned(lastMonthValue, currencyCode)}
            color={lastMonthValue < 0 ? 'text-expense' : 'text-income'}
          />
        </Card>
        <Card className="p-4 flex justify-center">
          <Statistic
            title="6 month average"
            value={formatDollarsSigned(monthlyAverage, currencyCode)}
            color={monthlyAverage < 0 ? 'text-expense' : 'text-income'}
          />
        </Card>
      </div>
    </>
  )
}

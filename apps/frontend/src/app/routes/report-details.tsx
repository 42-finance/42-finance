import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { parseISO } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { formatDateInUtc, formatDollarsSigned, formatPercentage, groupTransactions } from 'frontend-utils'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CashFlowFilter, CategoryType } from 'shared-types'

import { Avatar } from '../components/common/avatar'
import { Card } from '../components/common/card/card'
import { FilterSelect } from '../components/common/filter-select'
import { Statistic } from '../components/common/statistic'
import { useUserTokenContext } from '../contexts/user-token.context'

export const ReportDetails: React.FC = () => {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { currencyCode } = useUserTokenContext()

  const parsedDate = useMemo(() => (date ? parseISO(date) : new Date()), [date])

  const [selectedFilter, setSelectedFilter] = useState(CashFlowFilter.Category)

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
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

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => t.date.getUTCMonth() === parsedDate.getUTCMonth()),
    [transactions, parsedDate]
  )

  const incomeTransactions = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.category.group.type === CategoryType.Income)
        .map((t) => ({ ...t, convertedAmount: -t.convertedAmount })),
    [filteredTransactions]
  )

  const incomeValue = useMemo(() => _.sumBy(incomeTransactions, 'convertedAmount'), [incomeTransactions])

  const incomeGroupedTransactions = useMemo(
    () => groupTransactions(incomeTransactions, selectedFilter),
    [incomeTransactions, selectedFilter]
  )

  const expenseTransactions = useMemo(
    () => filteredTransactions.filter((t) => t.category.group.type === CategoryType.Expense),
    [filteredTransactions]
  )

  const expenseValue = useMemo(() => _.sumBy(expenseTransactions, 'convertedAmount'), [expenseTransactions])

  const expenseGroupedTransactions = useMemo(
    () => groupTransactions(expenseTransactions, selectedFilter),
    [expenseTransactions, selectedFilter]
  )

  const cashFlowValue = useMemo(() => incomeValue - expenseValue, [expenseValue, incomeValue])

  const renderCategory = (category: { id: number; icon: string; name: string }, value: number, percentage: number) => {
    return (
      <div key={category.id} className="pb-4 first:mt-4 bg-background">
        <div
          className="flex items-center w-full relative px-4 h-[50px] cursor-pointer hover:opacity-75"
          onClick={() => {
            switch (selectedFilter) {
              case CashFlowFilter.Category:
                navigate(`/category/${category.id}?date=${formatDateInUtc(parsedDate, 'yyyy-MM-dd')}`)
                break
              case CashFlowFilter.Group:
                navigate(`/group/${category.id}?date=${formatDateInUtc(parsedDate, 'yyyy-MM-dd')}`)
                break
              case CashFlowFilter.Merchant:
                navigate(`/merchant/${category.id}?date=${formatDateInUtc(parsedDate, 'yyyy-MM-dd')}`)
                break
            }
          }}
        >
          <div
            className="rounded-r absolute top-0 left-0 bottom-0 bg-secondaryContainer "
            style={{ width: `${Math.abs(percentage)}%` }}
          />

          <div className="flex items-center w-full z-10">
            {selectedFilter === CashFlowFilter.Category ? (
              <div className="text-base" style={{ marginRight: 15 }}>
                {category.icon}
              </div>
            ) : selectedFilter === CashFlowFilter.Group ? null : (
              <>
                {!_.isEmpty(category.icon) && (
                  <Avatar className="mr-3">
                    <img src={category.icon} />
                  </Avatar>
                )}
              </>
            )}
            <div className="text-base" style={{ flex: 1, marginRight: 15 }}>
              {category.name}
            </div>

            <div className="text-base">
              {formatDollarsSigned(value, currencyCode)} ({formatPercentage(percentage)})
            </div>
          </div>
        </div>
      </div>
    )
  }

  const options = [
    { label: 'Category', value: CashFlowFilter.Category },
    { label: 'Group', value: CashFlowFilter.Group },
    { label: 'Merchant', value: CashFlowFilter.Merchant }
  ]

  const filter = () => {
    return (
      <FilterSelect<string>
        data={options}
        name="Select Setting"
        onChange={(option) => {
          setSelectedFilter(option as CashFlowFilter)
        }}
        value={selectedFilter}
        width={'min-w-[220px]'}
        allowClear={false}
      />
    )
  }

  return (
    <div className="md:p-4">
      <Card title={formatDateInUtc(parsedDate, 'MMMM yyyy')}>
        <div className="grid gap-3 mt-3 md:m-3 md:grid-cols-3">
          <Card className="p-4 flex justify-center">
            <Statistic title="Income" value={formatDollarsSigned(incomeValue, currencyCode)} color="text-income" />
          </Card>
          <Card className="p-4 flex justify-center">
            <Statistic title="Expenses" value={formatDollarsSigned(expenseValue, currencyCode)} color="text-expense" />
          </Card>
          <Card className="p-4 flex justify-center">
            <Statistic
              title="Cash Flow"
              value={formatDollarsSigned(cashFlowValue, currencyCode)}
              color={cashFlowValue < 0 ? 'text-expense' : 'text-income'}
            />
          </Card>
        </div>
      </Card>

      <Card title="Income" className="mt-4" extra={filter()}>
        {incomeGroupedTransactions.map((c) => renderCategory(c.key, c.value, c.percentage))}
      </Card>

      <Card title="Expenses" className="mt-4" extra={filter()}>
        {expenseGroupedTransactions.map((c) => renderCategory(c.key, c.value, c.percentage))}
      </Card>
    </div>
  )
}

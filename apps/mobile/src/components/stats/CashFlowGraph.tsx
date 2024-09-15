import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransactions } from 'frontend-api'
import {
  filterByGraphType,
  formatDateInUtc,
  groupTransactionsByMonth,
  groupTransactionsByQuarter,
  groupTransactionsByWeek,
  groupTransactionsByYear,
  mapGraphType
} from 'frontend-utils'
import { sumBy } from 'lodash'
import { useMemo } from 'react'
import { Divider, Text, useTheme } from 'react-native-paper'
import { ReportDateFilter, ReportGraphType } from 'shared-types'

import { expenseColor, incomeColor } from '../../constants/theme'
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { MonthlyBarChart } from '../charts/MonthlyBarChart'
import { View } from '../common/View'
import { CashFlowInfo } from './CashFlowInfo'

const formatDate = (date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return `W${formatDateInUtc(date, 'w yy').toUpperCase()}`
    case ReportDateFilter.Monthly:
      return formatDateInUtc(date, 'MMM yy').toUpperCase()
    case ReportDateFilter.Quarterly:
      return `Q${formatDateInUtc(date, 'Q yy').toUpperCase()}`
    case ReportDateFilter.Yearly:
      return formatDateInUtc(date, 'yyyy').toUpperCase()
  }
}

type Props = {
  onSelected: (date: Date) => void
  dateFilter: ReportDateFilter
  graphType: ReportGraphType
}

export const CashFlowGraph: React.FC<Props> = ({ onSelected, dateFilter, graphType }) => {
  const { colors } = useTheme()

  const {
    data: transactions = [],
    refetch: refetchTransactions,
    isFetching
  } = useQuery({
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

  useRefetchOnFocus(refetchTransactions)

  const filteredTransactions = useMemo(() => filterByGraphType(transactions, graphType), [transactions])

  const groupedTransactions = useMemo(() => {
    switch (dateFilter) {
      case ReportDateFilter.Weekly:
        return groupTransactionsByWeek(filteredTransactions)
      case ReportDateFilter.Monthly:
        return groupTransactionsByMonth(filteredTransactions)
      case ReportDateFilter.Quarterly:
        return groupTransactionsByQuarter(filteredTransactions)
      case ReportDateFilter.Yearly:
        return groupTransactionsByYear(filteredTransactions)
    }
  }, [filteredTransactions, dateFilter])

  const monthlyData = useMemo(
    () =>
      groupedTransactions.map(({ key, transactions }) => {
        const value = sumBy(transactions, 'convertedAmount')
        return {
          value: graphType === ReportGraphType.Expense ? value : -value,
          frontColor: value < 0 ? incomeColor : expenseColor,
          label: formatDate(key, dateFilter),
          date: key
        }
      }),
    [groupedTransactions]
  )

  return (
    <>
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text variant="titleMedium">{mapGraphType(graphType)}</Text>
      </View>
      <Divider />
      <View style={{ alignSelf: 'center', marginVertical: 20 }}>
        <MonthlyBarChart data={monthlyData} onSelected={(date) => onSelected(date)} loading={isFetching} />
      </View>
      <Divider />
      <CashFlowInfo
        groupedTransactions={groupedTransactions}
        dateFilter={dateFilter}
        isExpense={graphType === ReportGraphType.Expense}
      />
      <Divider />
    </>
  )
}

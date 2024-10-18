import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { startOfMonth } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Category } from 'frontend-types'
import {
  filterTransactionsByDateFilter,
  formatDateLongWithDateFilter,
  formatDollarsSigned,
  groupTransactions
} from 'frontend-utils'
import { dateToUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { PieChart } from 'react-native-gifted-charts'
import { Text, useTheme } from 'react-native-paper'
import { CashFlowFilter, CategoryType, ReportDateFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { NoData } from '../common/NoData'
import { View } from '../common/View'

type Props = {
  dateFilter: ReportDateFilter
}

export const CategorySpendingGraph: React.FC<Props> = ({ dateFilter }) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [date] = useState(dateToUtc(startOfMonth(todayInUtc())))
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
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

  const filteredTransactions = useMemo(
    () => filterTransactionsByDateFilter(transactions, date, dateFilter),
    [transactions, date, dateFilter]
  )

  const expenseTransactions = useMemo(
    () => filteredTransactions.filter((t) => t.category.group.type === CategoryType.Expense),
    [filteredTransactions]
  )

  const expenseValue = useMemo(
    () =>
      _.sumBy(
        expenseTransactions.filter((t) => selectedCategory == null || t.categoryId === selectedCategory.id),
        'convertedAmount'
      ),
    [expenseTransactions, selectedCategory]
  )

  const expenseGroupedTransactions = useMemo(
    () => groupTransactions(expenseTransactions, CashFlowFilter.Category),
    [expenseTransactions]
  )

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text variant="titleLarge">{formatDateLongWithDateFilter(date, dateFilter)}</Text>
      {expenseGroupedTransactions.length === 0 && (
        <View style={{ marginTop: 15 }}>
          <NoData text="No transactions" />
        </View>
      )}
      <PieChart
        data={expenseGroupedTransactions}
        donut
        focusOnPress
        innerRadius={100}
        radius={150}
        innerCircleColor={colors.elevation.level2}
        onPress={(item) => {
          setSelectedCategory(item.key)
        }}
        centerLabelComponent={() => {
          return (
            <View style={{ alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ textAlign: 'center' }}>
                {selectedCategory ? selectedCategory.name : 'Total spending'}
              </Text>
              <Text variant="bodyLarge">{formatDollarsSigned(expenseValue, currencyCode)}</Text>
            </View>
          )
        }}
      />
    </View>
  )
}

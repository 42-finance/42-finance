import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { startOfMonth } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { filterTransactionsByDateFilter, formatDollarsSigned } from 'frontend-utils'
import { dateToUtc, todayInUtc } from 'frontend-utils/src/date/date.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { Text } from 'react-native-paper'
import { CategoryType, ReportDateFilter } from 'shared-types'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'

type Props = {
  dateFilter: ReportDateFilter
}

export const DateSpending: React.FC<Props> = ({ dateFilter }) => {
  const { currencyCode } = useUserTokenContext()

  const [date] = useState(dateToUtc(startOfMonth(todayInUtc())))

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

  const expenseValue = useMemo(() => _.sumBy(expenseTransactions, 'convertedAmount'), [expenseTransactions])

  return (
    <View style={{ position: 'relative', alignItems: 'center', marginVertical: 20 }}>
      <Text variant="headlineLarge">{formatDollarsSigned(expenseValue, currencyCode)}</Text>
      <Text variant="titleLarge" style={{ marginTop: 15 }}>
        Spent This Month
      </Text>
    </View>
  )
}

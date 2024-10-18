import { useNavigation } from '@react-navigation/native'
import { startOfMonth } from 'date-fns'
import {
  calculateBudgetProgress,
  dateToLocal,
  dateToUtc,
  filterTransactionsByDateFilter,
  formatDateShortWithDateFilter,
  formatDateWithDateFilter,
  formatDollars,
  formatDollarsSigned
} from 'frontend-utils'
import { mapCategoryTypeToColor } from 'frontend-utils/src/mappers/map-category-type'
import {
  groupTransactionsByMonth,
  groupTransactionsByQuarter,
  groupTransactionsByWeek,
  groupTransactionsByYear
} from 'frontend-utils/src/transaction/transaction.utils'
import _, { sumBy } from 'lodash'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType, ReportDateFilter } from 'shared-types'

import { Transaction } from '../../../../../libs/frontend-types/src/transaction.type'
import { expenseColor, incomeColor } from '../../constants/theme'
import { useUserTokenContext } from '../../contexts/user-token.context'
import { MonthlyBarChart } from '../charts/MonthlyBarChart'
import { View } from '../common/View'
import { TransactionItem } from '../list-items/TransactionItem'

type Props = {
  transactions: Transaction[]
  date: Date | null
  budgetAmount?: number
  type: CategoryType
  dateFilter: ReportDateFilter
}

export const CategoryReport: React.FC<Props> = ({ transactions, date, budgetAmount, type, dateFilter }) => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [selectedDate, setSelectedDate] = useState(date ? dateToUtc(startOfMonth(dateToLocal(date))) : null)

  const filteredTransactions = useMemo(
    () => (selectedDate ? filterTransactionsByDateFilter(transactions, selectedDate, dateFilter) : transactions),
    [transactions, selectedDate, dateFilter]
  )

  const totalValue = useMemo(
    () =>
      filteredTransactions.length === 0
        ? 0
        : _.sumBy(
            filteredTransactions.map((t) => ({
              ...t,
              convertedAmount: type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount
            })),
            'convertedAmount'
          ),
    [filteredTransactions, type]
  )

  const averageTransaction = useMemo(
    () =>
      filteredTransactions.length === 0
        ? 0
        : _.meanBy(
            filteredTransactions.map((t) => ({
              ...t,
              convertedAmount: type === CategoryType.Income ? -t.convertedAmount : t.convertedAmount
            })),
            'convertedAmount'
          ),
    [filteredTransactions, type]
  )

  const groupedTransactions = useMemo(() => {
    switch (dateFilter) {
      case ReportDateFilter.Weekly:
        return groupTransactionsByWeek(transactions)
      case ReportDateFilter.Monthly:
        return groupTransactionsByMonth(transactions)
      case ReportDateFilter.Quarterly:
        return groupTransactionsByQuarter(transactions)
      case ReportDateFilter.Yearly:
        return groupTransactionsByYear(transactions)
    }
  }, [transactions, dateFilter])

  const chartData = useMemo(
    () =>
      groupedTransactions.map(({ key, transactions }) => {
        const value = sumBy(transactions, 'convertedAmount')
        return {
          value,
          frontColor:
            key.getTime() === selectedDate?.getTime() ? colors.outline : value < 0 ? incomeColor : expenseColor,
          label: formatDateShortWithDateFilter(key, dateFilter),
          date: key
        }
      }),
    [groupedTransactions, type, selectedDate, colors.outline]
  )

  return (
    <ScrollView style={{ marginTop: 5 }}>
      <View style={{ alignSelf: 'center', marginTop: 20 }}>
        <MonthlyBarChart
          data={chartData}
          onSelected={(date) => setSelectedDate((oldDate) => (oldDate?.getTime() === date.getTime() ? null : date))}
          loading={false}
        />
      </View>
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          marginTop: 15
        }}
      >
        <Text variant="titleMedium">
          {selectedDate ? formatDateWithDateFilter(selectedDate, dateFilter) : 'All transactions'}
        </Text>
      </View>
      <Divider />
      {budgetAmount != null && selectedDate != null && dateFilter === ReportDateFilter.Monthly && (
        <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: colors.elevation.level2 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="titleMedium" style={{ flex: 1 }}>
              Remaining budget
            </Text>
            <Text variant="titleMedium">{formatDollarsSigned(budgetAmount - totalValue, currencyCode)}</Text>
          </View>
          <ProgressBar
            progress={calculateBudgetProgress(totalValue, budgetAmount)}
            style={{
              borderRadius: 50,
              backgroundColor: colors.outline,
              marginVertical: 10,
              height: 8
            }}
            color={mapCategoryTypeToColor(type)}
          />
          <Text variant="bodyMedium" style={{ color: colors.outline }}>
            {formatDollars(budgetAmount, currencyCode, 0)} budget
          </Text>
        </View>
      )}
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Total amount
        </Text>
        <Text variant="titleMedium">{formatDollarsSigned(totalValue, currencyCode)}</Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Average transaction
        </Text>
        <Text variant="titleMedium">{formatDollarsSigned(averageTransaction, currencyCode)}</Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          paddingHorizontal: 15,
          paddingVertical: 15,
          flexDirection: 'row'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Transactions
        </Text>
        <Text variant="titleMedium">{filteredTransactions.length}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        {filteredTransactions.map((transaction) => (
          <View key={transaction.id} style={{ backgroundColor: colors.elevation.level2 }}>
            <Divider />
            <TransactionItem
              transaction={transaction}
              onSelected={() => {
                navigation.navigate('Transaction', { transactionId: transaction.id })
              }}
              showDate
              showAccount
            />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

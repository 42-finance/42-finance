import { useNavigation } from '@react-navigation/native'
import { startOfMonth } from 'date-fns'
import {
  calculateBudgetProgress,
  dateToLocal,
  dateToUtc,
  formatDateInUtc,
  formatDollars,
  formatDollarsSigned
} from 'frontend-utils'
import { mapCategoryTypeToColor } from 'frontend-utils/src/mappers/map-category-type'
import { groupTransactionsByMonth } from 'frontend-utils/src/transaction/transaction.utils'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { Transaction } from '../../../../../libs/frontend-types/src/transaction.type'
import { MonthlyBarChart } from '../charts/MonthlyBarChart'
import { View } from '../common/View'
import { TransactionItem } from '../list-items/TransactionItem'

type Props = {
  transactions: Transaction[]
  date: Date | null
  budgetAmount?: number
  type: CategoryType
}

export const CategoryReport: React.FC<Props> = ({ transactions, date, budgetAmount, type }) => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const [selectedDate, setSelectedDate] = useState(date ? dateToUtc(startOfMonth(dateToLocal(date))) : null)

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => !selectedDate || t.date.getUTCMonth() === selectedDate.getUTCMonth()),
    [transactions, selectedDate]
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

  const monthTransactions = useMemo(() => groupTransactionsByMonth(transactions), [transactions])

  const monthlyData = useMemo(
    () =>
      monthTransactions.map(({ key, transactions }) => ({
        value: Math.abs(_.sumBy(transactions, 'convertedAmount')),
        frontColor:
          key.getTime() === selectedDate?.getTime()
            ? colors.outline
            : mapCategoryTypeToColor(type ?? CategoryType.Income),
        label: formatDateInUtc(key, 'MMM').toUpperCase(),
        date: key
      })),
    [monthTransactions, type, selectedDate, colors.outline]
  )

  const transactionGroups = useMemo(
    () =>
      _.chain(filteredTransactions)
        .groupBy('date')
        .map((value, key) => ({ title: key, data: value }))
        .value(),
    [filteredTransactions]
  )

  return (
    <ScrollView style={{ marginTop: 5 }}>
      <View style={{ alignSelf: 'center', marginTop: 20 }}>
        <MonthlyBarChart
          data={monthlyData}
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
        <Text variant="titleMedium">{selectedDate ? formatDateInUtc(selectedDate, 'MMMM yyyy') : 'Last 6 months'}</Text>
      </View>
      <Divider />
      {budgetAmount != null && (
        <View style={{ paddingHorizontal: 15, paddingVertical: 20, backgroundColor: colors.elevation.level2 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="titleMedium" style={{ flex: 1 }}>
              Remaining budget
            </Text>
            <Text variant="titleMedium">{formatDollarsSigned(budgetAmount - totalValue)}</Text>
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
            {formatDollars(budgetAmount, 0)} budget
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
        <Text variant="titleMedium">{formatDollarsSigned(totalValue)}</Text>
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
        <Text variant="titleMedium">{formatDollarsSigned(averageTransaction)}</Text>
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
      {transactionGroups.map((transactionGroup) => (
        <View key={transactionGroup.title}>
          <Text style={{ padding: 10, backgroundColor: colors.surface }}>
            {formatDateInUtc(new Date(transactionGroup.title), 'MMMM d, yyyy')}
          </Text>
          {transactionGroup.data.map((transaction) => (
            <View key={transaction.id} style={{ backgroundColor: colors.elevation.level2 }}>
              <Divider />
              <TransactionItem
                transaction={transaction}
                onSelected={() => {
                  navigation.navigate('Transaction', { transactionId: transaction.id })
                }}
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

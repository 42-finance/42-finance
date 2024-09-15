import {
  getMonth,
  getQuarter,
  getWeek,
  getYear,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subMonths,
  subQuarters,
  subWeeks,
  subYears
} from 'date-fns'
import { Transaction } from 'frontend-types'
import {
  GroupedTransaction,
  dateToLocal,
  dateToUtc,
  formatDollarsSigned,
  mapReportDateFilter,
  mapReportDateFilterShort
} from 'frontend-utils'
import _ from 'lodash'
import React, { useMemo } from 'react'
import { Divider, Text, useTheme } from 'react-native-paper'
import { ReportDateFilter } from 'shared-types'

import { expenseColor, incomeColor } from '../../constants/theme'
import { View } from '../common/View'

const getCurrentTransactions = (transactions: Transaction[], dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly: {
      const thisWeek = dateToUtc(startOfWeek(new Date()))
      return transactions.filter(
        (t) =>
          getWeek(dateToLocal(thisWeek)) === getWeek(dateToLocal(t.date)) &&
          getYear(dateToLocal(thisWeek)) === getYear(dateToLocal(t.date))
      )
    }
    case ReportDateFilter.Monthly: {
      const thisMonth = dateToUtc(startOfMonth(new Date()))
      return transactions.filter(
        (t) =>
          getMonth(dateToLocal(thisMonth)) === getMonth(dateToLocal(t.date)) &&
          getYear(dateToLocal(thisMonth)) === getYear(dateToLocal(t.date))
      )
    }
    case ReportDateFilter.Quarterly: {
      const thisQuarter = dateToUtc(startOfQuarter(new Date()))
      return transactions.filter(
        (t) =>
          getQuarter(dateToLocal(thisQuarter)) === getQuarter(dateToLocal(t.date)) &&
          getYear(dateToLocal(thisQuarter)) === getYear(dateToLocal(t.date))
      )
    }
    case ReportDateFilter.Yearly: {
      const thisYear = dateToUtc(startOfYear(new Date()))
      return transactions.filter((t) => getYear(dateToLocal(thisYear)) === getYear(dateToLocal(t.date)))
    }
  }
}

const getLastTransactions = (transactions: Transaction[], dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly: {
      const lastWeek = dateToUtc(startOfMonth(subWeeks(new Date(), 1)))
      return transactions.filter(
        (t) =>
          getWeek(dateToLocal(lastWeek)) === getWeek(dateToLocal(t.date)) &&
          getYear(dateToLocal(lastWeek)) === getYear(dateToLocal(t.date))
      )
    }
    case ReportDateFilter.Monthly: {
      const lastMonth = dateToUtc(startOfMonth(subMonths(new Date(), 1)))
      return transactions.filter(
        (t) =>
          getMonth(dateToLocal(lastMonth)) === getMonth(dateToLocal(t.date)) &&
          getYear(dateToLocal(lastMonth)) === getYear(dateToLocal(t.date))
      )
    }
    case ReportDateFilter.Quarterly: {
      const lastQuarter = dateToUtc(startOfMonth(subQuarters(new Date(), 1)))
      return transactions.filter(
        (t) =>
          getQuarter(dateToLocal(lastQuarter)) === getQuarter(dateToLocal(t.date)) &&
          getYear(dateToLocal(lastQuarter)) === getYear(dateToLocal(t.date))
      )
    }
    case ReportDateFilter.Yearly: {
      const lastYear = dateToUtc(startOfMonth(subYears(new Date(), 1)))
      return transactions.filter((t) => getYear(dateToLocal(lastYear)) === getYear(dateToLocal(t.date)))
    }
  }
}

type Props = {
  groupedTransactions: GroupedTransaction<Date>[]
  dateFilter: ReportDateFilter
  isExpense?: boolean
}

export const CashFlowInfo: React.FC<Props> = ({ groupedTransactions, dateFilter, isExpense }) => {
  const { colors } = useTheme()

  const transactions = useMemo(
    () =>
      groupedTransactions
        .flatMap((g) => g.transactions)
        .map((t) => ({ ...t, convertedAmount: isExpense ? t.convertedAmount : -t.convertedAmount })),
    [groupedTransactions]
  )

  const currentTransactions = useMemo(
    () => getCurrentTransactions(transactions, dateFilter),
    [transactions, dateFilter]
  )

  const lastTransactions = useMemo(() => getLastTransactions(transactions, dateFilter), [transactions, dateFilter])

  const totalValue = useMemo(() => _.sumBy(transactions, 'convertedAmount'), [transactions])

  const currentValue = useMemo(() => _.sumBy(currentTransactions, 'convertedAmount'), [currentTransactions])

  const lastValue = useMemo(() => _.sumBy(lastTransactions, 'convertedAmount'), [lastTransactions])

  const average = useMemo(() => {
    if (groupedTransactions.length === 0) return 0
    return totalValue / groupedTransactions.length
  }, [totalValue, groupedTransactions.length])

  const getColor = (value: number) => {
    if (isExpense) {
      return value < 0 ? incomeColor : expenseColor
    }
    return value < 0 ? expenseColor : incomeColor
  }

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
        <Text variant="titleMedium" style={{ flex: 1 }}>
          This {mapReportDateFilterShort(dateFilter)}
        </Text>
        <Text variant="titleMedium" style={{ color: getColor(currentValue) }}>
          {formatDollarsSigned(currentValue)}
        </Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          Last {mapReportDateFilterShort(dateFilter)}
        </Text>
        <Text variant="titleMedium" style={{ color: getColor(lastValue) }}>
          {formatDollarsSigned(lastValue)}
        </Text>
      </View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.elevation.level2,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text variant="titleMedium" style={{ flex: 1 }}>
          {mapReportDateFilter(dateFilter)} average
        </Text>
        <Text variant="titleMedium" style={{ color: getColor(average) }}>
          {formatDollarsSigned(average)}
        </Text>
      </View>
    </>
  )
}

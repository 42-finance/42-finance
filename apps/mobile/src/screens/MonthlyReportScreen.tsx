import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfMonth, endOfQuarter, endOfWeek, parseISO } from 'date-fns'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Transaction } from 'frontend-types'
import {
  dateToLocal,
  dateToUtc,
  formatDateInUtc,
  formatDollarsSigned,
  formatPercentage,
  groupTransactions
} from 'frontend-utils'
import { mapCashFlowFilter } from 'frontend-utils/src/mappers/map-cash-flow-filter'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import { Avatar, Chip, Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CashFlowFilter, CategoryType, ReportDateFilter } from 'shared-types'

import { View } from '../components/common/View'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

const formatDate = (date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return `${formatDateInUtc(date, 'MMM dd yyyy')} - ${formatDateInUtc(dateToUtc(endOfWeek(dateToLocal(date))), 'MMM dd yyyy')}`
    case ReportDateFilter.Monthly:
      return formatDateInUtc(date, 'MMMM yyyy')
    case ReportDateFilter.Quarterly:
      return `${formatDateInUtc(date, 'MMM yyyy')} - ${formatDateInUtc(dateToUtc(endOfQuarter(dateToLocal(date))), 'MMM yyyy')}`
    case ReportDateFilter.Yearly:
      return formatDateInUtc(date, 'yyyy')
  }
}

const formatDateLong = (date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return `${formatDateInUtc(date, 'MMMM dd yyyy')} - ${formatDateInUtc(dateToUtc(endOfWeek(dateToLocal(date))), 'MMMM dd yyyy')}`
    case ReportDateFilter.Monthly:
      return formatDateInUtc(date, 'MMMM yyyy')
    case ReportDateFilter.Quarterly:
      return `${formatDateInUtc(date, 'MMMM yyyy')} - ${formatDateInUtc(dateToUtc(endOfQuarter(dateToLocal(date))), 'MMMM yyyy')}`
    case ReportDateFilter.Yearly:
      return formatDateInUtc(date, 'yyyy')
  }
}

const filterByDateFilter = (transactions: Transaction[], date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return transactions.filter(
        (t) =>
          t.date.getTime() >= date.getTime() && t.date.getTime() <= dateToUtc(endOfWeek(dateToLocal(date))).getTime()
      )
    case ReportDateFilter.Monthly:
      return transactions.filter(
        (t) =>
          t.date.getTime() >= date.getTime() && t.date.getTime() <= dateToUtc(endOfMonth(dateToLocal(date))).getTime()
      )
    case ReportDateFilter.Quarterly:
      return transactions.filter(
        (t) =>
          t.date.getTime() >= date.getTime() && t.date.getTime() <= dateToUtc(endOfQuarter(dateToLocal(date))).getTime()
      )
    case ReportDateFilter.Yearly:
      return transactions.filter((t) => t.date.getUTCFullYear() >= date.getUTCFullYear())
  }
}

export const MonthlyReportScreen = ({ navigation, route }: RootStackScreenProps<'MonthlyReport'>) => {
  const { date, dateFilter } = route.params

  const { colors } = useTheme()

  const parsedDate = useMemo(() => parseISO(date), [date])

  const [selectedFilter, setSelectedFilter] = useState(CashFlowFilter.Category)

  useEffect(() => {
    navigation.setOptions({
      title: formatDate(parsedDate, dateFilter)
    })
  }, [navigation, parsedDate])

  const {
    data: transactions = [],
    isFetching: fetchingTransactions,
    refetch: refetchTransactions
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

  const filteredTransactions = useMemo(
    () => filterByDateFilter(transactions, parsedDate, dateFilter),
    [transactions, parsedDate, dateFilter]
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

  const width = Dimensions.get('window').width

  const renderCategory = (category: { id: number; icon: string; name: string }, value: number, percentage: number) => {
    return (
      <View key={category.id} style={{ paddingBottom: 15, backgroundColor: colors.elevation.level2 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: 15,
            height: 50,
            position: 'relative'
          }}
          onPress={() => {
            switch (selectedFilter) {
              case CashFlowFilter.Category:
                navigation.navigate('Category', { categoryId: category.id, date: parsedDate.toISOString() })
                break
              case CashFlowFilter.Group:
                navigation.navigate('Group', { groupId: category.id, date: parsedDate.toISOString() })
                break
              case CashFlowFilter.Merchant:
                navigation.navigate('Merchant', { merchantId: category.id, date: parsedDate.toISOString() })
                break
            }
          }}
        >
          <View
            style={{
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: colors.secondaryContainer,
              width: width * (Math.abs(percentage) / 100)
            }}
          />
          {selectedFilter === CashFlowFilter.Category ? (
            <Text variant="titleMedium" style={{ marginRight: 15 }}>
              {category.icon}
            </Text>
          ) : selectedFilter === CashFlowFilter.Group ? null : (
            <>
              {!_.isEmpty(category.icon) && (
                <Avatar.Image size={30} source={{ uri: category.icon }} style={{ marginEnd: 15 }} />
              )}
            </>
          )}
          <Text variant="titleMedium" style={{ flex: 1, marginRight: 15 }} numberOfLines={1}>
            {category.name}
          </Text>
          <Text variant="titleMedium">
            {formatDollarsSigned(value)} ({formatPercentage(percentage)})
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <ProgressBar indeterminate visible={fetchingTransactions} />
      <ScrollView>
        <View style={{ backgroundColor: colors.elevation.level2, padding: 20, marginTop: 20 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            {formatDateLong(parsedDate, dateFilter)}
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
          <Avatar.Icon size={12} icon={() => null} style={{ marginEnd: 10, backgroundColor: '#19d2a5' }} />
          <Text variant="titleMedium" style={{ flex: 1 }}>
            Income
          </Text>
          <Text variant="titleMedium" style={{ color: '#19d2a5' }}>
            {formatDollarsSigned(incomeValue)}
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
          <Avatar.Icon size={12} icon={() => null} style={{ marginEnd: 10, backgroundColor: '#f0648c' }} />
          <Text variant="titleMedium" style={{ flex: 1 }}>
            Expenses
          </Text>
          <Text variant="titleMedium" style={{ color: '#f0648c' }}>
            {formatDollarsSigned(expenseValue)}
          </Text>
        </View>
        <Divider />
        <View
          style={{
            backgroundColor: colors.elevation.level2,
            padding: 20,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Avatar.Icon size={12} icon={() => null} style={{ marginEnd: 10, backgroundColor: '#43546e' }} />
          <Text variant="titleMedium" style={{ flex: 1 }}>
            Cash Flow
          </Text>
          <Text variant="titleMedium" style={{ color: cashFlowValue < 0 ? '#f0648c' : '#19d2a5' }}>
            {formatDollarsSigned(cashFlowValue)}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.elevation.level2,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            Income
          </Text>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: colors.elevation.level2
          }}
        >
          {Object.values(CashFlowFilter).map((type) => (
            <Chip
              key={type}
              onPress={() => {
                setSelectedFilter(type)
              }}
              theme={{ roundness: 20 }}
              style={{
                padding: 2,
                flex: 1,
                ...(selectedFilter === type ? {} : { backgroundColor: 'transparent' })
              }}
              textStyle={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center', flex: 1 }}
            >
              {mapCashFlowFilter(type).toUpperCase()}
            </Chip>
          ))}
        </View>

        {incomeGroupedTransactions.map((c) => renderCategory(c.key, c.value, c.percentage))}

        <View style={{ backgroundColor: colors.elevation.level2, padding: 20, marginTop: 20 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
            Expenses
          </Text>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: colors.elevation.level2
          }}
        >
          {Object.values(CashFlowFilter).map((type) => (
            <Chip
              key={type}
              onPress={() => {
                setSelectedFilter(type)
              }}
              theme={{ roundness: 20 }}
              style={{
                padding: 2,
                flex: 1,
                ...(selectedFilter === type ? {} : { backgroundColor: 'transparent' })
              }}
              textStyle={{ fontWeight: 'bold', fontSize: 12, textAlign: 'center', flex: 1 }}
            >
              {mapCashFlowFilter(type).toUpperCase()}
            </Chip>
          ))}
        </View>

        {expenseGroupedTransactions.map((c) => renderCategory(c.key, c.value, c.percentage))}
      </ScrollView>
    </View>
  )
}

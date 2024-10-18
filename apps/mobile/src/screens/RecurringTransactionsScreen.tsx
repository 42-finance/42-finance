import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { startOfMonth } from 'date-fns'
import { ApiQuery, getRecurringTransactions } from 'frontend-api'
import { RecurringTransaction } from 'frontend-types'
import { dateToUtc, formatDateInUtc, getNextRecurringDate, getRecurringDatesForMonth } from 'frontend-utils'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { ProgressBar, Text, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { RecurringTransactionItem } from '../components/list-items/RecurringTransactionItem'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const RecurringTransactionsScreen = ({ navigation }: RootStackScreenProps<'RecurringTransactions'>) => {
  const { colors } = useTheme()

  const [selectedMonth, setSelectedMonth] = useState(dateToUtc(startOfMonth(new Date())))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const {
    data: transactions = [],
    isFetching: fetching,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.RecurringTransactions],
    queryFn: async () => {
      const res = await getRecurringTransactions()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddRecurringTransaction', {})}>
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors, navigation])

  const onSelected = useCallback(
    (transaction: RecurringTransaction) => {
      navigation.navigate('RecurringTransaction', { recurringTransactionId: transaction.id })
    },
    [navigation]
  )

  const recurringTransactions = useMemo(() => {
    const dates: (RecurringTransaction & { dates: Date[]; nextDate?: Date })[] = []
    for (const transaction of transactions) {
      const recurringDates = getRecurringDatesForMonth(
        selectedMonth,
        transaction.startDate,
        transaction.frequency,
        transaction.interval
      )
      const nextDate = getNextRecurringDate(transaction.startDate, transaction.frequency, transaction.interval)
      dates.push({
        ...transaction,
        dates: recurringDates,
        nextDate
      })
    }
    return dates.sort((a, b) => {
      if (a.nextDate == null || b.nextDate == null) {
        return 0
      }
      return a.nextDate.getTime() - b.nextDate.getTime()
    })
  }, [selectedMonth, transactions])

  const markedDates = useMemo(() => {
    const dates = recurringTransactions.flatMap((t) => t.dates)
    const marked = {}
    for (const date of dates) {
      const formattedDate = formatDateInUtc(date, 'yyyy-MM-dd')
      if (marked[formattedDate]) {
        marked[formattedDate].dots.push({ color: colors.primary })
      } else {
        marked[formattedDate] = { dots: [{ color: colors.primary }] }
      }
    }
    return marked
  }, [colors.primary, recurringTransactions])

  const selectedDateTransactions = useMemo(() => {
    if (selectedDate == null) {
      return []
    }
    return recurringTransactions.filter((t) => {
      return t.dates.some((d) => d.getTime() === selectedDate.getTime())
    })
  }, [recurringTransactions, selectedDate])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'transparent'
      }}
    >
      <ProgressBar indeterminate visible={fetching} />
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(new Date(day.dateString))
        }}
        onMonthChange={({ dateString }) => {
          setSelectedMonth(dateToUtc(startOfMonth(new Date(dateString))))
        }}
        style={{
          marginBottom: 10
        }}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.background,
          textSectionTitleColor: colors.onSurface,
          todayTextColor: colors.primary,
          dayTextColor: colors.onSurface,
          dotColor: colors.primary,
          arrowColor: colors.primary,
          monthTextColor: colors.onSurface,
          textDayFontFamily: 'Barlow',
          textMonthFontFamily: 'Barlow',
          textDayHeaderFontFamily: 'Barlow',
          dotStyle: { width: 6, height: 6, borderRadius: 100, marginTop: 3 }
        }}
        hideExtraDays
        markedDates={markedDates}
        markingType="multi-dot"
      />
      <ScrollView>
        {selectedDate && selectedDateTransactions.length > 0 && (
          <View>
            <Text variant="titleMedium" numberOfLines={1} style={{ marginLeft: 10, marginBottom: 10 }}>
              {formatDateInUtc(selectedDate, 'MMM dd')}
            </Text>
            <View>
              {selectedDateTransactions.map((t) => (
                <RecurringTransactionItem key={t.id} transaction={t} date={selectedDate} onSelected={onSelected} />
              ))}
            </View>
          </View>
        )}
        <Text variant="titleMedium" numberOfLines={1} style={{ marginLeft: 10, marginVertical: 10 }}>
          Upcoming
        </Text>
        {recurringTransactions.map((transaction) => (
          <RecurringTransactionItem key={transaction.id} transaction={transaction} onSelected={onSelected} />
        ))}
      </ScrollView>
    </View>
  )
}

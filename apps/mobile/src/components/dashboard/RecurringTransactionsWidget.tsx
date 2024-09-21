import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { startOfMonth } from 'date-fns'
import { ApiQuery, getRecurringTransactions } from 'frontend-api'
import { RecurringTransaction } from 'frontend-types'
import { dateToUtc, getNextRecurringDate, getRecurringDatesForMonth } from 'frontend-utils'
import { useMemo } from 'react'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { NoData } from '../common/NoData'
import { View } from '../common/View'
import { RecurringTransactionItem } from '../list-items/RecurringTransactionItem'

export const RecurringTransactionsWidget = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const { data: transactions = [], refetch } = useQuery({
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

  const recurringTransactions = useMemo(() => {
    const dates: (RecurringTransaction & { dates: Date[]; nextDate?: Date })[] = []
    for (const transaction of transactions) {
      const recurringDates = getRecurringDatesForMonth(
        dateToUtc(startOfMonth(new Date())),
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
    return dates
      .sort((a, b) => {
        if (a.nextDate == null || b.nextDate == null) {
          return 0
        }
        return a.nextDate.getTime() - b.nextDate.getTime()
      })
      .slice(0, 4)
  }, [transactions])

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Recurring Transactions
        </Text>
        <View style={{ marginTop: 15 }} />
        {recurringTransactions.map((transaction) => (
          <View key={transaction.id}>
            <Divider />
            <RecurringTransactionItem
              transaction={transaction}
              onSelected={(transaction) =>
                navigation.navigate('RecurringTransaction', { recurringTransactionId: transaction.id })
              }
              backgroundColor="transparent"
            />
          </View>
        ))}
        {recurringTransactions.length === 0 && <NoData text="No recurring transactions" />}
        <Divider />
        <Button
          mode="outlined"
          style={{ marginHorizontal: 15, marginTop: 10 }}
          onPress={() => navigation.navigate('RecurringTransactionsTab')}
        >
          View all recurring transactions
        </Button>
      </Card.Content>
    </Card>
  )
}

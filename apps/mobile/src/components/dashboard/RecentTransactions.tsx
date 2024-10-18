import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getTransactions } from 'frontend-api'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { NoData } from '../common/NoData'
import { View } from '../common/View'
import { TransactionItem } from '../list-items/TransactionItem'

export const RecentTransactions = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: [ApiQuery.DashboardTransactions],
    queryFn: async () => {
      const res = await getTransactions({ limit: 4 })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetchTransactions)

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Recent Transactions
        </Text>
        <Divider style={{ marginTop: 15 }} />
        {transactions.map((transaction) => (
          <View key={transaction.id}>
            <Divider />
            <TransactionItem
              transaction={transaction}
              onSelected={(transaction) => navigation.navigate('Transaction', { transactionId: transaction.id })}
              showAccount
              showDate
            />
          </View>
        ))}
        {transactions.length === 0 && <NoData text="No transactions" />}
        <Divider />
        <Button
          mode="outlined"
          style={{ marginHorizontal: 15, marginTop: 10 }}
          onPress={() => navigation.navigate('TransactionsTab')}
        >
          View all transactions
        </Button>
      </Card.Content>
    </Card>
  )
}

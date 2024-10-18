import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditTransactionsRequest, editTransactions, getTransactions } from 'frontend-api'
import { useTransactionsFilterContext } from 'frontend-utils'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'
import { TransactionItem } from '../list-items/TransactionItem'

export const ReviewTransactions = () => {
  const navigation = useNavigation()
  const { setNeedsReview } = useTransactionsFilterContext()
  const queryClient = useQueryClient()
  const { colors } = useTheme()

  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: [ApiQuery.ReviewTransactions],
    queryFn: async () => {
      const res = await getTransactions({ limit: 4, needsReview: true })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetchTransactions)

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: EditTransactionsRequest) => {
      const res = await editTransactions(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.ReviewTransactions] })
      }
    }
  })

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Transactions To Review
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
        {transactions.length === 0 && (
          <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', padding: 20 }}>
            <MaterialIcons name="money-off" size={48} color={colors.onSurface} />
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              No transactions
            </Text>
          </View>
        )}
        <Divider />
        <Button
          mode="outlined"
          style={{ marginHorizontal: 15, marginTop: 10 }}
          onPress={() => {
            setNeedsReview(true)
            navigation.navigate('TransactionsTab')
          }}
        >
          View all transactions
        </Button>
        <Button
          mode="contained"
          style={{ marginHorizontal: 15, marginTop: 10 }}
          onPress={() => {
            mutate({
              transactionIds: [],
              needsReview: false
            })
          }}
          loading={isPending}
          disabled={isPending}
        >
          Mark all as reviewed
        </Button>
      </Card.Content>
    </Card>
  )
}

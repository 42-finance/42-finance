import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getBills } from 'frontend-api'
import { todayInUtc } from 'frontend-utils'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { NoData } from '../common/NoData'
import { View } from '../common/View'
import { BillItem } from '../list-items/BillItem'

export const BillsWidget = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const { data: bills = [], refetch } = useQuery({
    queryKey: [ApiQuery.Bills],
    queryFn: async () => {
      const res = await getBills({ startDate: todayInUtc() })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Upcoming Bills
        </Text>
        <Divider style={{ marginTop: 15 }} />
        {bills.map((bill) => (
          <View key={bill.id}>
            <Divider />
            <BillItem bill={bill} onSelected={(bill) => navigation.navigate('Bill', { billId: bill.id })} />
          </View>
        ))}
        {bills.length === 0 && <NoData text="No upcoming bills" />}
        <Divider />
        <Button
          mode="outlined"
          style={{ marginHorizontal: 15, marginTop: 10 }}
          onPress={() => navigation.navigate('Bills')}
        >
          View all bills
        </Button>
      </Card.Content>
    </Card>
  )
}

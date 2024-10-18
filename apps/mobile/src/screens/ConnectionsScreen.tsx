import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getConnections } from 'frontend-api'
import { ScrollView } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { ConnectionGroup } from '../components/account/ConnectionGroup'
import { View } from '../components/common/View'

export const ConnectionsScreen = () => {
  const { data: connections = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Connections],
    queryFn: async () => {
      const res = await getConnections()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <ScrollView style={{ marginTop: 5 }}>
        {connections.map((connection) => (
          <ConnectionGroup key={connection.id} connection={connection} />
        ))}
      </ScrollView>
    </View>
  )
}

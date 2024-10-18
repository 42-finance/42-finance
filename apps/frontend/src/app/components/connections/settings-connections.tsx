import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getConnections } from 'frontend-api'

import { ConnectionGroup } from './connection-group'

export const SettingsConnections = () => {
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
    <div>
      {connections.map((connection) => (
        <ConnectionGroup connection={connection} />
      ))}
    </div>
  )
}

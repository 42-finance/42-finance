import { QuilttButton, useQuilttSession } from '@quiltt/react'
import { useQuery } from '@tanstack/react-query'
import { ApiQuery, getSessionToken } from 'frontend-api'
import { useEffect } from 'react'
import { RiAddFill } from 'react-icons/ri'

import { Tooltip } from '../common/tooltip/tooltip'

export const AddQuilttConnection = () => {
  const { session, importSession, revokeSession } = useQuilttSession()

  const { data: sessionToken, isFetching: fetchingSessionToken } = useQuery({
    queryKey: [ApiQuery.SessionToken],
    queryFn: async () => {
      const res = await getSessionToken()
      if (res.ok && res.parsedBody?.payload?.token) {
        return res.parsedBody.payload.token
      }
    }
  })

  useEffect(() => {
    if (sessionToken) {
      importSession(sessionToken)
    }
  }, [sessionToken])

  console.log(session?.token)

  const handleLoad = (metadata: any) => console.log(`Connector ${metadata.connectorId} loaded!`)

  const handleExitSuccess = (metadata: any) => console.log('Successfully added: ', metadata.connectionId)

  return (
    <Tooltip body="Add account" placement="bottom" className="">
      <QuilttButton connectorId="dubnqsi4s4" onLoad={handleLoad} onExitSuccess={handleExitSuccess}>
        <RiAddFill className="w-6 h-6 -mb-1" color="rgb(26, 28, 30)" />
      </QuilttButton>
    </Tooltip>
  )
}

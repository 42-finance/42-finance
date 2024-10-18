import { useMutation } from '@tanstack/react-query'
import { getLinkToken } from 'frontend-api'
import { useState } from 'react'

import { Button } from '../common/button/button'
import { LaunchLink } from './launch-link'

export const AddConnection = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null)

  const { mutate: mutateLinkToken, isPending: fetchingLinkToken } = useMutation({
    mutationFn: async () => {
      const res = await getLinkToken()
      if (res.ok && res.parsedBody?.payload?.linkToken) {
        setLinkToken(res.parsedBody.payload.linkToken)
      }
    }
  })

  return (
    <>
      <Button
        type="primary"
        disabled={fetchingLinkToken || linkToken != null}
        loading={fetchingLinkToken || linkToken != null}
        onClick={() => mutateLinkToken()}
      >
        Add Account
      </Button>
      {linkToken && <LaunchLink token={linkToken} onExitCallback={() => setLinkToken(null)} />}
    </>
  )
}

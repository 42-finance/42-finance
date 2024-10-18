import {
  CreateAccessTokenRequest,
  EditConnectionRequest,
  createAccessToken,
  editConnection,
  getLinkToken
} from 'frontend-api'
import { setMessage } from 'frontend-utils'
import { useCallback, useState } from 'react'
import { Platform } from 'react-native'
import { LinkExit, LinkSuccess } from 'react-native-plaid-link-sdk'
import { create, open } from 'react-native-plaid-link-sdk/dist/PlaidLink'

export const usePlaid = () => {
  const [loading, setLoading] = useState(false)
  const [connectionLimitReached, setConnectionLimitReached] = useState(false)

  const createLink = useCallback(async (connectionId?: string) => {
    setLoading(true)
    const res = await getLinkToken({ connectionId, platform: Platform.OS })
    if (res.ok && res.parsedBody?.payload) {
      const data = res.parsedBody.payload
      if (data.linkToken) {
        create({ token: data.linkToken })
      } else {
        setConnectionLimitReached(true)
      }
    }
    setLoading(false)
  }, [])

  const updateConnection = useCallback(
    async (connectionId: string, request: EditConnectionRequest, onSuccess: () => void) => {
      const res = await editConnection(connectionId, request)
      if (res.ok) {
        setMessage('Connection has been updated successfully')
      }
      onSuccess()
    },
    []
  )

  const createToken = useCallback(async (request: CreateAccessTokenRequest, onSuccess: () => void) => {
    const res = await createAccessToken(request)
    if (res.ok) {
      setMessage(
        'Account linked successfully. Your accounts and transactions are syncing and will be available shortly.'
      )
    }
    onSuccess()
  }, [])

  const openLink = useCallback(
    (onExit: () => void, onSuccess: () => void, connectionId?: string) => {
      open({
        onSuccess: (success: LinkSuccess) => {
          console.log(success)
          if (connectionId) {
            updateConnection(
              connectionId,
              {
                needsTokenRefresh: false
              },
              onSuccess
            )
          } else {
            createToken(
              {
                publicToken: success.publicToken,
                institutionId: success.metadata.institution!.id,
                accounts: success.metadata.accounts
              },
              onSuccess
            )
          }
        },
        onExit: (linkExit: LinkExit) => {
          console.log(linkExit)
          onExit()
        }
      })
    },
    [createToken, updateConnection]
  )

  return { createLink, openLink, loading, connectionLimitReached }
}

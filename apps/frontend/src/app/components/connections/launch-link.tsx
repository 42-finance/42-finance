import { useQueryClient } from '@tanstack/react-query'
import {
  ApiQuery,
  CreateAccessTokenRequest,
  EditConnectionRequest,
  createAccessToken,
  editConnection
} from 'frontend-api'
import React, { useEffect } from 'react'
import {
  PlaidLinkError,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkStableEvent,
  usePlaidLink
} from 'react-plaid-link'
import { toast } from 'react-toastify'

type Props = {
  token: string
  connectionId?: string
  isOauth?: boolean
  onExitCallback: () => void
}

export const LaunchLink: React.FC<Props> = ({ isOauth, token, connectionId, onExitCallback }) => {
  const queryClient = useQueryClient()

  const updateConnection = async (connectionId: string, request: EditConnectionRequest) => {
    const res = await editConnection(connectionId, request)
    if (res.ok) {
      toast.success('Connection has been updated successfully')
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
    }
  }

  const createToken = async (request: CreateAccessTokenRequest) => {
    const res = await createAccessToken(request)
    if (res.ok) {
      toast.success(
        'Account linked successfully. Your accounts and transactions are syncing and will be available shortly.'
      )
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
      queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
    }
  }

  const onSuccess = async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    console.log('Success: ', publicToken, metadata)

    if (connectionId) {
      updateConnection(connectionId, { needsTokenRefresh: false })
    } else {
      createToken({ publicToken, institutionId: metadata.institution!.institution_id, accounts: metadata.accounts })
    }

    onExitCallback()
  }

  const onExit = async (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
    console.log('Exit: ', error, metadata)
    onExitCallback()
  }

  const onEvent = async (eventName: PlaidLinkStableEvent | string, metadata: PlaidLinkOnEventMetadata) => {
    console.log('Event: ', eventName, metadata)
  }

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    onExit,
    onEvent,
    token
  }

  if (isOauth) {
    config.receivedRedirectUri = window.location.href // add additional receivedRedirectUri config when handling an OAuth reidrect
  }

  const { open, ready } = usePlaidLink(config)

  useEffect(() => {
    if (isOauth && ready) {
      open()
    } else if (ready) {
      localStorage.setItem(
        'oauthConfig',
        JSON.stringify({
          itemId: connectionId,
          token
        })
      )
      open()
    }
  }, [ready, open, isOauth, connectionId, token])

  return <></>
}

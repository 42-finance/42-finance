import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteAccount, getAccount, getLinkToken, getTransactions } from 'frontend-api'
import { Account } from 'frontend-types'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AccountBalance } from '../components/account/account-balance'
import { Alert } from '../components/common/alert/alert'
import { Button } from '../components/common/button/button'
import { Card } from '../components/common/card/card'
import { confirmModal } from '../components/common/confirm-modal/confirm-modal'
import { LaunchLink } from '../components/connections/launch-link'
import { EditAccountModal } from '../components/modals/edit-account-modal'
import { TransactionItem } from '../components/transaction/transaction-item'

export const AccountDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [showEditAccount, setShowEditAccount] = useState<boolean>(false)

  const { data: account, isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Account, id],
    queryFn: async () => {
      const res = await getAccount(id as string)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  const { data: transactions = [], isFetching: fetchingTransactions } = useQuery({
    queryKey: [ApiQuery.AccountTransactions, account],
    queryFn: async () => {
      const res = await getTransactions({ limit: 4, accountIds: [account!.id] })
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    enabled: account != null,
    placeholderData: keepPreviousData
  })

  const { mutate: mutateLinkToken, isPending: fetchingLinkToken } = useMutation({
    mutationFn: async () => {
      const res = await getLinkToken({ connectionId: account?.connectionId ?? undefined })
      if (res.ok && res.parsedBody?.payload?.linkToken) {
        setLinkToken(res.parsedBody.payload.linkToken)
      }
    }
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async (accountId: string) => {
      const res = await deleteAccount(accountId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        navigate('/')
      }
    }
  })

  const onDelete = async (account: Account) => {
    if (await confirmModal({ content: 'Are you sure you want to delete this account?' })) {
      deleteMutation(account.id)
    }
  }

  if (!account) {
    return null
  }

  return (
    <div className="flex flex-col p-4 gap-4">
      {account.connection?.needsTokenRefresh && (
        <Alert
          message={
            <div className="flex items-center w-full">
              <div className="grow">
                {account.connection.institutionName} is no longer syncing due to outdated credentials. Update the
                connection to resume syncing.
              </div>
              <Button
                type="primary"
                className="ml-2"
                disabled={fetchingLinkToken || linkToken != null}
                loading={fetchingLinkToken || linkToken != null}
                onClick={() => mutateLinkToken()}
              >
                Update Connection
              </Button>
            </div>
          }
          type="error"
          showIcon
          className="!mb-0"
        />
      )}
      <Card
        title={account.name}
        extra={
          <div>
            <Button type="primary" disabled={submittingDelete} onClick={() => setShowEditAccount(true)}>
              Edit Account
            </Button>
            <Button
              type="primary"
              danger
              className="ml-2"
              disabled={submittingDelete}
              onClick={() => onDelete(account)}
            >
              Delete Account
            </Button>
          </div>
        }
      >
        <AccountBalance account={account} />
      </Card>
      <Card title="Recent Transactions">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </Card>
      {linkToken && account.connectionId && (
        <LaunchLink token={linkToken} connectionId={account.connectionId} onExitCallback={() => setLinkToken(null)} />
      )}
      {showEditAccount && <EditAccountModal onClose={() => setShowEditAccount(false)} accountId={account.id} />}
    </div>
  )
}

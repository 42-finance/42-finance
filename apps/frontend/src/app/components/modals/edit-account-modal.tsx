import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditAccountRequest, editAccount, getAccount } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { AccountForm, AccountFormFields } from '../forms/account-form'

type Props = {
  onClose: () => void
  accountId: string
}

export const EditAccountModal: React.FC<Props> = ({ onClose, accountId }) => {
  const queryClient = useQueryClient()

  const { data: account } = useQuery({
    queryKey: [ApiQuery.Account, accountId],
    queryFn: async () => {
      const res = await getAccount(accountId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditAccountRequest) => {
      const res = await editAccount(accountId, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        toast.success('Account updated')
        onClose()
      }
    }
  })

  const onSubmit = (formData: AccountFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Edit Account"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="account-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      {!account && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {account && (
        <AccountForm onSubmit={onSubmit} accountInfo={account} canChangeCurrency={account.connectionId == null} />
      )}
    </Modal>
  )
}

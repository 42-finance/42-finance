import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddTransactionRequest, ApiQuery, addTransaction } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { TransactionForm, TransactionFormFields } from '../forms/transaction-form'

type Props = {
  onClose: () => void
}

export const AddTransactionModal: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddTransactionRequest) => {
      const res = await addTransaction(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        toast.success('Transaction added')
        onClose()
      }
    }
  })

  const onSubmit = (formData: TransactionFormFields) => {
    mutate({
      date: formData.date,
      amount: formData.type === 'debit' ? formData.amount : -formData.amount,
      accountId: formData.accountId as string,
      categoryId: formData.categoryId as number,
      merchantName: formData.merchantName
    })
  }

  return (
    <Modal
      title="Add Transaction"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="transaction-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      <TransactionForm mode="add" onSubmit={onSubmit} />
    </Modal>
  )
}

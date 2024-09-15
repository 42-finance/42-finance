import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditTransactionsRequest, editTransactions } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { MultipleTransactionsForm, MultipleTransactionsFormFields } from '../forms/multiple-transactions-form'

type Props = {
  onClose: () => void
  transactionIds: string[]
}

export const EditMultipleTransactionsModal: React.FC<Props> = ({ transactionIds, onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (request: EditTransactionsRequest) => {
      const res = await editTransactions(request)
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        toast.success('Transactions updated')
        onClose()
      }
    }
  })

  const onSubmit = (formData: MultipleTransactionsFormFields) => {
    mutate({
      transactionIds,
      date: formData.date ?? undefined,
      categoryId: formData.categoryId ?? undefined,
      hidden: formData.hidden ?? undefined,
      needsReview: formData.needsReview ?? undefined
    })
  }

  return (
    <Modal
      title="Edit Transactions"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="multiple-transaction-form" type="primary" htmlType="submit" disabled={isPending}>
          Submit
        </Button>
      ]}
    >
      <MultipleTransactionsForm onSubmit={onSubmit} />
    </Modal>
  )
}

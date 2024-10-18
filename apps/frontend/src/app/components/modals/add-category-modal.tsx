import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddCategoryRequest, ApiQuery, addCategory } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { CategoryForm, CategoryFormFields } from '../forms/category-form'

type Props = {
  onClose: () => void
}

export const AddCategoryModal: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddCategoryRequest) => {
      const res = await addCategory(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupsList] })
        onClose()
        toast.success('Category added')
      }
    }
  })

  const onSubmit = (formData: CategoryFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Add Category"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="category-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      <CategoryForm mode="add" onSubmit={onSubmit} />
    </Modal>
  )
}

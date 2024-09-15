import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditCategoryRequest, editCategory, getCategory } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { CategoryForm, CategoryFormFields } from '../forms/category-form'

type Props = {
  onClose: () => void
  categoryId: number
}

export const EditCategoryModal: React.FC<Props> = ({ categoryId, onClose }) => {
  const queryClient = useQueryClient()

  const { data: category } = useQuery({
    queryKey: [ApiQuery.Category, categoryId],
    queryFn: async () => {
      const res = await getCategory(categoryId)
      if (res.ok && res.parsedBody) {
        return res.parsedBody.payload
      }
    },
    gcTime: 0
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditCategoryRequest) => {
      const res = await editCategory(categoryId, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupsList] })
        onClose()
        toast.success('Category updated')
      }
    }
  })

  const onSubmit = (formData: CategoryFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Edit Category"
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
      {!category && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {category && <CategoryForm mode="edit" onSubmit={onSubmit} categoryInfo={category} />}
    </Modal>
  )
}

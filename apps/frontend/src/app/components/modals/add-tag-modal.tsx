import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddTagRequest, ApiQuery, addTag } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { TagForm, TagFormFields } from '../forms/tag-form'

type Props = {
  onClose: () => void
}

export const AddTagModal: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddTagRequest) => {
      const res = await addTag(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Tags] })
        toast.success('Tag added')
        onClose()
      }
    }
  })

  const onSubmit = (formData: TagFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Add Tag"
      onClose={onClose}
      maxWidth="max-w-[25rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="tag-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      <TagForm onSubmit={onSubmit} />
    </Modal>
  )
}

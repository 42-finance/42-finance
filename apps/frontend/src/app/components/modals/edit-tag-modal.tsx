import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditTagRequest, editTag, getTag } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { TagForm, TagFormFields } from '../forms/tag-form'

type Props = {
  onClose: () => void
  tagId: number
}

export const EditTagModal: React.FC<Props> = ({ tagId, onClose }) => {
  const queryClient = useQueryClient()

  const { data: tag } = useQuery({
    queryKey: [ApiQuery.Tag, tagId],
    queryFn: async () => {
      const res = await getTag(tagId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditTagRequest) => {
      const res = await editTag(tagId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Tag] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Tags] })
        toast.success('Tag updated')
        onClose()
      }
    }
  })

  const onSubmit = (formData: TagFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Edit Tag"
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
      {!tag && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {tag && <TagForm onSubmit={onSubmit} tagInfo={tag} />}
    </Modal>
  )
}

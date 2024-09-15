import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddGroupRequest, ApiQuery, addGroup } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { GroupForm, GroupFormFields } from '../forms/group-form'

type Props = {
  onClose: () => void
}

export const AddGroupModal: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddGroupRequest) => {
      const res = await addGroup(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupsList] })
        toast.success('Group added')
        onClose()
      }
    }
  })

  const onSubmit = (formData: GroupFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Add Group"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="group-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      <GroupForm mode="add" onSubmit={onSubmit} />
    </Modal>
  )
}

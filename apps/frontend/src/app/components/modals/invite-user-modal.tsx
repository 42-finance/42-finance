import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, InviteUserRequest, addUserInvite } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { InviteUserForm, InviteUserFormFields } from '../forms/invite-user-form'

type Props = {
  onClose: () => void
}

export const InviteUserModal: React.FC<Props> = ({ onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: InviteUserRequest) => {
      const res = await addUserInvite(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.HouseholdUsers] })
        toast.success(
          'Successfully sent an invitation to the provided email. If they do not receive an email you can try inviting them again.'
        )
        onClose()
      }
    }
  })

  const onSubmit = (formData: InviteUserFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Invite User"
      onClose={onClose}
      maxWidth="max-w-[25rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="category-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      <InviteUserForm onSubmit={onSubmit} />
    </Modal>
  )
}

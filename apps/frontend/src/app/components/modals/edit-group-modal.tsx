import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditGroupRequest, editGroup, getGroup } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { GroupForm, GroupFormFields } from '../forms/group-form'

type Props = {
  onClose: () => void
  groupId: number
}

export const EditGroupModal: React.FC<Props> = ({ groupId, onClose }) => {
  const queryClient = useQueryClient()

  const { data: group } = useQuery({
    queryKey: [ApiQuery.Group, groupId],
    queryFn: async () => {
      const res = await getGroup(groupId)
      if (res.ok && res.parsedBody) {
        return res.parsedBody.payload
      }
    },
    gcTime: 0
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditGroupRequest) => {
      const res = await editGroup(groupId, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupsList] })
        toast.success('Group updated')
        onClose()
      }
    }
  })

  const onSubmit = (formData: GroupFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Edit Group"
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
      {!group && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {group && <GroupForm mode="edit" onSubmit={onSubmit} groupInfo={group} />}
    </Modal>
  )
}

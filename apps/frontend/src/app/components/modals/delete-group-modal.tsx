import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteGroup, getGroups } from 'frontend-api'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { Button } from '../common/button/button'
import { FormSelect } from '../common/form/form-select'
import { Modal } from '../common/modal/modal'

type Props = {
  onClose: () => void
  groupId: number
  groupName: string
  categoryCount: number
}

export const DeleteGroupModal: React.FC<Props> = ({ groupId, groupName, categoryCount, onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (newGroupId: number) => {
      const res = await deleteGroup(groupId, { newGroupId })
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        onClose()
        toast.success('Group deleted')
      }
    }
  })

  const { data: groups = [], isFetching: fetchingGroups } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const groupItems = useMemo(
    () =>
      groups
        .filter((g) => g.id !== groupId)
        .map((g) => ({
          label: g.name,
          value: g.id
        })),
    [groups]
  )

  const schema = Yup.object().shape({
    groupId: Yup.number().required('Group is required').nullable().notOneOf([null], 'Group is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      groupId: null
    }
  })

  const mapCategoryCount = () => {
    if (categoryCount === 1) {
      return `is ${categoryCount} category`
    }

    return `are ${categoryCount} categories`
  }

  return (
    <Modal
      title="Delete Group"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="delete-group-form" type="primary" htmlType="submit" disabled={isPending}>
          Submit
        </Button>
      ]}
    >
      <div className="px-4">
        <div className="my-4">
          There {mapCategoryCount()} nested in the group "{groupName}". Before you delete it, where should we move them
          to?
        </div>

        <form
          id="delete-group-form"
          data-testid="delete-group-form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit((values) => mutate(values.groupId as number))}
        >
          <div>
            <FormSelect
              control={control}
              errors={errors.groupId?.message}
              label="Group"
              name="groupId"
              options={groupItems}
              loading={fetchingGroups}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

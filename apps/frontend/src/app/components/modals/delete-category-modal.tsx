import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteCategory, getGroups } from 'frontend-api'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { Button } from '../common/button/button'
import { FormSelectGroup } from '../common/form/form-select-group'
import { Modal } from '../common/modal/modal'

type Props = {
  onClose: () => void
  categoryId: number
  categoryIcon: string
  categoryName: string
}

export const DeleteCategoryModal: React.FC<Props> = ({ categoryId, categoryIcon, categoryName, onClose }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (mapToCategoryId: number) => {
      const res = await deleteCategory(categoryId, { mapToCategoryId })
      if (res.ok && res.parsedBody?.payload) {
        onClose()
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupsList] })
        toast.success('Category deleted')
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
      groups.map((g) => ({
        label: g.name,
        options: g.categories
          .filter((c) => c.id !== categoryId)
          .map((c) => ({ label: `${c.icon} ${c.name}`, value: c.id }))
      })),
    [groups]
  )

  const schema = Yup.object().shape({
    categoryId: Yup.number().required('Category is required').nullable().notOneOf([null], 'Category is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryId: null
    }
  })

  return (
    <Modal
      title="Delete Category"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="delete-category-form" type="primary" htmlType="submit" disabled={isPending}>
          Submit
        </Button>
      ]}
    >
      <div className="px-4">
        <div className="mt-4">
          You will no longer see {categoryIcon} {categoryName} as a category anywhere in the app including budgets, cash
          flow or transactions.
        </div>

        <div className="my-3">
          Where would you like any existing transactions and rules to be reassigned? Any new transactions that would be
          placed in this category will also be assigned to the selected category.
        </div>

        <form
          id="delete-category-form"
          data-testid="delete-category-form"
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit((values) => mutate(values.categoryId as number))}
        >
          <div>
            <FormSelectGroup
              control={control}
              errors={errors.categoryId?.message}
              label="Category"
              name="categoryId"
              options={groupItems}
              loading={fetchingGroups}
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

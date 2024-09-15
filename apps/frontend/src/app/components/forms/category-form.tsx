import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGroups } from 'frontend-api'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { FormEmoji } from '../common/form/form-emoji'
import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'

export type CategoryFormFields = {
  name: string
  icon: string
  groupId: number
  hideFromBudget: boolean
  rolloverBudget: boolean
}

type Props = {
  categoryInfo?: CategoryFormFields | null
  onSubmit: SubmitHandler<CategoryFormFields>
  mode: 'add' | 'edit'
}

export const CategoryForm: React.FC<Props> = ({ onSubmit, categoryInfo, mode }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    icon: Yup.string().required('Icon is required'),
    groupId: Yup.number().min(1, 'Group is required').required('Group is required'),
    hideFromBudget: Yup.boolean().required('Exclude from budget is required'),
    rolloverBudget: Yup.boolean().required('Rollover budget is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<CategoryFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: categoryInfo?.name ?? '',
      icon: categoryInfo?.icon ?? '',
      groupId: categoryInfo?.groupId ?? -1,
      hideFromBudget: categoryInfo?.hideFromBudget ?? false,
      rolloverBudget: categoryInfo?.rolloverBudget ?? false
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

  const switchItems = useMemo(
    () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    []
  )

  return (
    <form
      id="category-form"
      data-testid="category-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormEmoji control={control} errors={errors.icon?.message} label="Icon" name="icon" />
        </div>
        <div>
          <FormSelect
            control={control}
            disabled={fetchingGroups}
            loading={fetchingGroups}
            errors={errors.groupId?.message}
            label="Group"
            name="groupId"
            options={groups?.map((d) => ({
              label: d.name,
              value: d.id ?? ''
            }))}
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.hideFromBudget?.message}
            label="Hide from budget"
            name="hideFromBudget"
            options={switchItems}
          />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.rolloverBudget?.message}
            label="Rollover remaining budget"
            name="rolloverBudget"
            options={switchItems}
          />
        </div>
      </div>
    </form>
  )
}

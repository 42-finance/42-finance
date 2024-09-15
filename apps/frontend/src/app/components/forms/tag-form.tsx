import { yupResolver } from '@hookform/resolvers/yup'
import { TagColor } from 'frontend-types'
import { mapTagColor } from 'frontend-utils'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'

export type TagFormFields = {
  name: string
  color: string
}

type Props = {
  tagInfo?: TagFormFields | null
  onSubmit: SubmitHandler<TagFormFields>
}

export const TagForm: React.FC<Props> = ({ onSubmit, tagInfo }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    color: Yup.string().required('Color is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<TagFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: tagInfo?.name ?? '',
      color: tagInfo?.color ?? ''
    }
  })

  return (
    <form id="tag-form" data-testid="tag-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
      </div>
      <div>
        <FormSelect<string>
          control={control}
          errors={errors.color?.message}
          label={<>Color</>}
          name="color"
          options={Object.values(TagColor).map((t) => ({ label: mapTagColor(t), value: t }))}
        />
      </div>
    </form>
  )
}

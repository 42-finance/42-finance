import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { UserPermission } from 'shared-types'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'

export type InviteUserFormFields = {
  email: string
  permission: UserPermission
}

type Props = {
  onSubmit: SubmitHandler<InviteUserFormFields>
}

export const InviteUserForm: React.FC<Props> = ({ onSubmit }) => {
  const schema = Yup.object().shape({
    email: Yup.string().email().trim().required('Email is required'),
    permission: Yup.mixed<UserPermission>().required('Permission is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<InviteUserFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      permission: UserPermission.Admin
    }
  })

  return (
    <form
      id="invite-user-form"
      data-testid="invite-user-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <FormInput control={control} errors={errors.email?.message} label="Email" name="email" type="email" />
      </div>
    </form>
  )
}

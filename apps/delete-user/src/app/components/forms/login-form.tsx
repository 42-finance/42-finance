import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { Button } from '../common/button/button'
import { FormInput } from '../common/form/form-input'

export type LoginFormFields = { email: string; password: string }

type Props = {
  onSubmit: (values: LoginFormFields) => void
  submitting: boolean
}

export const LoginForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const schema: Yup.ObjectSchema<LoginFormFields> = Yup.object().shape({
    email: Yup.string().trim().required('Please enter your email').email('Please enter a valid email'),
    password: Yup.string().required('Please enter your password')
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <form id="login-form" data-testid="login-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        control={control}
        errors={errors.email?.message}
        placeholder="Email"
        name="email"
        type="text"
        autoComplete
        heightClass="h-[60px]"
      />
      <FormInput
        control={control}
        errors={errors.password?.message}
        placeholder="Password"
        name="password"
        type="password"
        autoComplete
        heightClass="h-[60px]"
      />
      <Button data-testid="login-button" type="primary" htmlType="submit" block disabled={submitting} className="-mt-2">
        Login
      </Button>
    </form>
  )
}

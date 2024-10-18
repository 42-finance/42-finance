import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import { Button } from '../common/button/button'
import { FormInput } from '../common/form/form-input'

export type ForgotPasswordFormFields = { email: string }

type Props = {
  onSubmit: (values: ForgotPasswordFormFields) => void
  submitting: boolean
}

export const ForgotPasswordForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const schema: Yup.ObjectSchema<ForgotPasswordFormFields> = Yup.object().shape({
    email: Yup.string().trim().required('Please enter your email').email('Please enter a valid email')
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  return (
    <form
      id="forgot-password-form"
      className="forgot-password-form"
      data-testid="forgot-password-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        control={control}
        errors={errors.email?.message}
        placeholder="Email"
        name="email"
        type="text"
        heightClass="h-[60px]"
      />
      <Button type="primary" htmlType="submit" block disabled={submitting} className="mt-1">
        Submit
      </Button>
      <div className="text-right mt-6 text-lighter-green">
        <Link to="/login" data-testid="back-to-login">
          Back to login page
        </Link>
      </div>
    </form>
  )
}

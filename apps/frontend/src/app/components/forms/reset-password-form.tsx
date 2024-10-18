import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import { Button } from '../common/button/button'
import { FormInput } from '../common/form/form-input'

export type ResetPasswordFormFields = {
  password: string
  confirmPassword: string
}

type Props = {
  onSubmit: (values: ResetPasswordFormFields) => void
  submitting: boolean
}

export const ResetPasswordForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const schema: Yup.ObjectSchema<ResetPasswordFormFields> = Yup.object().shape({
    password: Yup.string()
      .required('Please enter a password')
      .min(10, 'Must be at least 10 characters')
      .matches(RegExp('(.*[a-z].*)'), 'Must have at least one lowercase letter')
      .matches(RegExp('(.*[A-Z].*)'), 'Must have at least one uppercase letter')
      .matches(RegExp('(.*\\d.*)'), 'Must have at least one number'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  })

  const {
    handleSubmit,
    control,
    formState: { errors, dirtyFields }
  } = useForm<ResetPasswordFormFields>({
    resolver: yupResolver(schema, { abortEarly: false }),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const checkForValidationError = (term: string) => {
    if (!dirtyFields.password) {
      return false
    }

    const validationErrors = errors?.password?.types?.matches as any

    return !validationErrors ? true : !validationErrors.includes(term)
  }

  const minOk = dirtyFields.password && errors?.password?.types?.min === undefined
  const uppercaseOk = checkForValidationError('Must have at least one uppercase letter')
  const lowercaseOk = checkForValidationError('Must have at least one lowercase letter')
  const numberOk = checkForValidationError('Must have at least one number')

  const renderRequirementIcon = (requirementMet: boolean | undefined) =>
    requirementMet ? (
      <FaCheckCircle className="text-lg mr-2 text-green-600" />
    ) : (
      <FaInfoCircle className="text-lg mr-2" />
    )

  return (
    <form
      id="reset-password-form"
      data-testid="reset-password-form"
      autoComplete="off"
      className="reset-password-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="text-xs mb-6 p-3 text-dark-greyish-blue">
        <div className="font-semibold mb-3 text-sm">Password must:</div>
        <div className="flex items-center mb-2">
          {renderRequirementIcon(minOk)}
          Be at least 10 characters
        </div>
        <div className="flex items-center mb-2">
          {renderRequirementIcon(uppercaseOk)}
          Have at least one uppercase letter
        </div>
        <div className="flex items-center mb-2">
          {renderRequirementIcon(lowercaseOk)}
          Have at least one lowercase letter
        </div>
        <div className="flex items-center">
          {renderRequirementIcon(numberOk)}
          Have at least one number
        </div>
      </div>
      <FormInput
        control={control}
        errors={errors.password?.message}
        placeholder="New Password"
        name="password"
        type="password"
        heightClass="h-[60px]"
      />
      <FormInput
        control={control}
        errors={errors.confirmPassword?.message}
        placeholder="Confirm Password"
        name="confirmPassword"
        type="password"
        heightClass="h-[60px]"
      />
      <Button type="primary" htmlType="submit" className="mt-1" block disabled={submitting}>
        Submit
      </Button>
      <div className="text-right mt-6 text-lighter-green">
        <Link data-testid="back-to-login" to="/login">
          Back to login page
        </Link>
      </div>
    </form>
  )
}

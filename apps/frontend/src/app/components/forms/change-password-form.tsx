import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import * as Yup from 'yup'

import { Alert } from '../common/alert/alert'
import { FormInput } from '../common/form/form-input'

export type ChangePasswordFormFields = {
  currentPassword: string
  password: string
  confirmPassword: string
}

type Props = {
  onSubmit: SubmitHandler<ChangePasswordFormFields>
}

export const ChangePasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const schema: Yup.ObjectSchema<ChangePasswordFormFields> = Yup.object().shape({
    currentPassword: Yup.string().required('Please enter your current password'),
    password: Yup.string()
      .required('Please enter a new password')
      .min(10, 'Must be at least 10 characters')
      .matches(RegExp('(.*[a-z].*)'), 'Must have at least one lowercase letter')
      .matches(RegExp('(.*[A-Z].*)'), 'Must have at least one uppercase letter')
      .matches(RegExp('(.*\\d.*)'), 'Must have at least one number'),
    confirmPassword: Yup.string()
      .required('Please confirm your new password')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  })

  const {
    handleSubmit,
    control,
    trigger,
    formState: { dirtyFields, errors }
  } = useForm<ChangePasswordFormFields>({
    resolver: yupResolver(schema, { abortEarly: false }),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      currentPassword: '',
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
      <FaInfoCircle className="text-lg mr-2 text-midnight-blue" />
    )

  return (
    <form
      id="change-password-form"
      data-testid="change-password-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <Alert
        className="text-xs mb-6"
        message={
          <div>
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
            <div className="flex items-center mb-1">
              {renderRequirementIcon(numberOk)}
              Have at least one number
            </div>
          </div>
        }
      />

      <FormInput
        control={control}
        errors={errors.currentPassword?.message}
        label="Enter Current Password"
        name="currentPassword"
        type="password"
      />
      <FormInput
        control={control}
        errors={errors.password?.message}
        label="Enter New Password"
        name="password"
        type="password"
        onChange={() => {
          if (errors.confirmPassword) {
            trigger('confirmPassword')
          }
        }}
      />
      <FormInput
        control={control}
        errors={errors.confirmPassword?.message}
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
      />
    </form>
  )
}

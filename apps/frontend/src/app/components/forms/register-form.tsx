import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import { Button } from '../common/button/button'
import { FormInput } from '../common/form/form-input'

export type RegisterFormFields = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type Props = {
  onSubmit: (values: RegisterFormFields) => void
  submitting: boolean
}

export const RegisterForm: React.FC<Props> = ({ onSubmit, submitting }) => {
  const schema: Yup.ObjectSchema<RegisterFormFields> = Yup.object().shape({
    name: Yup.string().trim().required('Please enter a name'),
    email: Yup.string().trim().required('Please enter an email').email('Please enter a valid email address'),
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
  } = useForm<RegisterFormFields>({
    resolver: yupResolver(schema, { abortEarly: false }),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'all',
    defaultValues: {
      email: '',
      name: '',
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
      id="register-form"
      data-testid="register-form"
      autoComplete="off"
      className="register-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput
            control={control}
            errors={errors.name?.message}
            placeholder="Name"
            name="name"
            type="text"
            heightClass="h-[60px]"
          />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.email?.message}
            placeholder="Email"
            name="email"
            type="text"
            heightClass="h-[60px]"
          />
        </div>
        <div className="md:col-span-3">
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
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.password?.message}
            placeholder="Enter Password"
            name="password"
            type="password"
            heightClass="h-[60px]"
          />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.confirmPassword?.message}
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            heightClass="h-[60px]"
          />
        </div>
        <div className="md:col-span-3">
          <Button type="primary" htmlType="submit" block disabled={submitting} className="mt-3">
            Sign up
          </Button>
        </div>
        <div className="md:col-span-3">
          <div className="text-right mt-6 text-lighter-green">
            <Link data-testid="back-to-login" to="/login">
              Back to login page
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}

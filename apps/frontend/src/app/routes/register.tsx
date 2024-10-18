import { useMutation } from '@tanstack/react-query'
import { RegisterRequest, register } from 'frontend-api'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { AnonymousLayout } from '../components/common/anonymous-layout'
import { RegisterForm, RegisterFormFields } from '../components/forms/register-form'

export const Register: React.FC = () => {
  const navigate = useNavigate()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (body: RegisterRequest) => {
      const res = await register(body)
      if (res.ok) {
        toast.success(
          'Thank you for registering. You will receive a confirmation email shortly. Follow the link in the email to complete your registration.'
        )
        navigate('/login')
      }
    }
  })

  const onSubmit = (formData: RegisterFormFields) => {
    mutate({
      email: formData.email.trim(),
      name: formData.name,
      password: formData.password
    })
  }

  return (
    <AnonymousLayout contentMaxWidth="max-w-[705px]">
      <RegisterForm onSubmit={onSubmit} submitting={submitting} />
    </AnonymousLayout>
  )
}

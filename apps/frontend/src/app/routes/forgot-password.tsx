import { useMutation } from '@tanstack/react-query'
import { ForgotPasswordRequest, forgotPassword } from 'frontend-api'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { AnonymousLayout } from '../components/common/anonymous-layout'
import { ForgotPasswordForm, ForgotPasswordFormFields } from '../components/forms/forgot-password-form'

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (body: ForgotPasswordRequest) => {
      const res = await forgotPassword(body)
      if (res.ok) {
        toast.success('Password reset email sent. Please check your inbox.')
        localStorage.clear()
        sessionStorage.removeItem('lastLocation')
        navigate('/login')
      }
    }
  })

  const onSubmit = (formData: ForgotPasswordFormFields) => {
    mutate({
      email: formData.email.trim()
    })
  }

  return (
    <AnonymousLayout>
      <div className="text-midnight-blue text-4xl font-bold mb-2.5">Forgot Password</div>
      <div className="max-w-[324px] mb-6 text-dark-greyish-blue">
        Don't worry. Just enter your email address below and we'll send you a password reset link.
      </div>
      <ForgotPasswordForm onSubmit={onSubmit} submitting={submitting} />
    </AnonymousLayout>
  )
}

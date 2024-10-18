import { useMutation } from '@tanstack/react-query'
import { ResetPasswordRequest, resetPassword } from 'frontend-api'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useQueryParam } from 'use-query-params'

import { AnonymousLayout } from '../components/common/anonymous-layout'
import { ResetPasswordForm, ResetPasswordFormFields } from '../components/forms/reset-password-form'

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [userId] = useQueryParam<string | undefined>('userId')
  const [token] = useQueryParam<string | undefined>('token')

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (body: ResetPasswordRequest) => {
      const res = await resetPassword(body)
      if (res.ok) {
        toast.success('Password has been reset')
        navigate('/login')
      }
    }
  })

  const onSubmit = (formData: ResetPasswordFormFields) => {
    if (userId && token) {
      mutate({
        newPassword: formData.password.trim(),
        token,
        userId: parseInt(userId, 10)
      })
    } else {
      toast.error('Missing required information')
    }
  }

  return (
    <AnonymousLayout>
      <div className="text-midnight-blue text-4xl font-bold mb-2.5">Reset Password</div>
      <ResetPasswordForm onSubmit={onSubmit} submitting={submitting} />
    </AnonymousLayout>
  )
}

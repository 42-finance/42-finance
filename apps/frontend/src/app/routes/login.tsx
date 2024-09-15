import { useMutation } from '@tanstack/react-query'
import { AppleLoginRequest, LoginRequest, login, loginWithApple } from 'frontend-api'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { AnonymousLayout } from '../components/common/anonymous-layout'
import { LoginForm, LoginFormFields } from '../components/forms/login-form'
import { useUserTokenContext } from '../contexts/user-token.context'
import { useSessionStorage } from '../hooks/use-session-storage.hook'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { setToken, setCurrencyCode } = useUserTokenContext()
  const [lastLocation] = useSessionStorage<string | null>('lastLocation', null)

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (body: LoginRequest) => {
      const res = await login(body)
      const payload = res.parsedBody?.payload
      if (payload?.token) {
        setToken(payload.token)
        setCurrencyCode(payload.currencyCode)
        if (lastLocation) {
          navigate(lastLocation)
        } else {
          navigate('/')
        }
      } else {
        localStorage.clear()
      }
    }
  })

  const onSubmit = (formData: LoginFormFields) => {
    mutate({
      email: formData.email.trim(),
      password: formData.password
    })
  }

  const { mutate: appleMutation, isPending: submittingApple } = useMutation({
    mutationFn: async (request: AppleLoginRequest) => {
      const res = await loginWithApple(request)
      const payload = res.parsedBody?.payload
      if (payload?.token) {
        setToken(payload.token)
        setCurrencyCode(payload.currencyCode)
        if (lastLocation) {
          navigate(lastLocation)
        } else {
          navigate('/')
        }
      } else {
        localStorage.clear()
      }
    }
  })

  const onSubmitApple = (request: AppleLoginRequest) => {
    appleMutation(request)
  }

  return (
    <AnonymousLayout>
      <LoginForm onSubmit={onSubmit} onSubmitApple={onSubmitApple} submitting={submitting || submittingApple} />
    </AnonymousLayout>
  )
}

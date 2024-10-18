import { useMutation } from '@tanstack/react-query'
import { ConfirmEmailRequest, confirmEmail } from 'frontend-api'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useQueryParam } from 'use-query-params'

import { Loader } from '../components/common/loader/loader'
import { useUserTokenContext } from '../contexts/user-token.context'

export const ConfirmEmail: React.FC = () => {
  const navigate = useNavigate()
  const [userId] = useQueryParam<string | undefined>('userId')
  const [token] = useQueryParam<string | undefined>('token')
  const { setToken } = useUserTokenContext()
  const initialized = useRef(false)

  const { mutate } = useMutation({
    mutationFn: async (body: ConfirmEmailRequest) => {
      const res = await confirmEmail(body)
      if (res.ok && res.parsedBody?.payload?.token) {
        toast.success('Your email has been confirmed.')
        setToken(res.parsedBody.payload.token)
        navigate('/')
      } else {
        navigate('/login')
      }
    }
  })

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      if (userId && token) {
        mutate({
          token,
          userId: parseInt(userId, 10)
        })
      } else {
        toast.error('Missing required information')
        navigate('/login')
      }
    }
  }, [])

  return <Loader />
}

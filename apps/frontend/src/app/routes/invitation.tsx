import { useMutation } from '@tanstack/react-query'
import { AcceptInvitationRequest, acceptInvitation } from 'frontend-api'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { StringParam, useQueryParam } from 'use-query-params'

import { Alert } from '../components/common/alert/alert'
import { AnonymousLayout } from '../components/common/anonymous-layout'
import { InvitationForm, InvitationFormFields } from '../components/forms/invitation-form'
import { useLocalStorage } from '../hooks/use-local-storage.hook'

export const Invitation: React.FC = () => {
  const navigate = useNavigate()
  const [, setToken] = useLocalStorage<string | null>('token', null)
  const [invitationToken] = useQueryParam('token', StringParam)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (invitationToken) {
      const decoded: {
        email: string
      } = jwtDecode(invitationToken)
      setEmail(decoded.email)
    }
  }, [invitationToken])

  const { mutate, isPending } = useMutation({
    mutationFn: async (body: AcceptInvitationRequest) => {
      const res = await acceptInvitation(body)
      if (res.ok && res.parsedBody) {
        toast.success('Invitation has been accepted')
        setToken(res.parsedBody.payload.token)
        navigate('/')
      }
    }
  })

  const onSubmit = (formData: InvitationFormFields) => {
    if (invitationToken) {
      mutate({
        token: invitationToken,
        email: formData.email.trim(),
        name: formData.name,
        password: formData.password
      })
    }
  }

  const renderNoToken = () => {
    if (invitationToken && email) {
      return null
    }

    return (
      <>
        <Alert showIcon type="error" message="The invitation token could not be found." className="mb-6" />
        <div className="flex justify-end">
          <Link to="/">Go to dashboard</Link>
        </div>
      </>
    )
  }

  const renderInvitation = () => {
    if (!invitationToken || !email) {
      return null
    }

    return (
      <>
        <p className="mb-6 text-midnight-blue">You've been invited to join a 42 Finance household.</p>
        <InvitationForm onSubmit={onSubmit} submitting={isPending} email={email} />
      </>
    )
  }

  return (
    <AnonymousLayout contentMaxWidth="max-w-[705px]">
      <div className="text-onSurface text-2xl mb-2.5">New Invitation</div>
      {renderInvitation()}
      {renderNoToken()}
    </AnonymousLayout>
  )
}

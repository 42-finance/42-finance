import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { LoginRequest, deleteUser, login } from 'frontend-api'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { AnonymousLayout } from '../components/common/anonymous-layout'
import { Button } from '../components/common/button/button'
import { LoginForm, LoginFormFields } from '../components/forms/login-form'
import { useUserTokenContext } from '../contexts/user-token.context'

export const Home: React.FC = () => {
  const { token, setToken } = useUserTokenContext()
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (body: LoginRequest) => {
      const res = await login(body)
      const payload = res.parsedBody?.payload
      if (payload?.token) {
        setToken(payload.token)
      } else {
        localStorage.clear()
      }
    }
  })

  const { mutate: deleteAccountMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteUser()
      if (res.ok && res.parsedBody?.payload) {
        toast.success('Your account and all data has been deleted.')
        setShowDeleteAccount(false)
        setToken(null)
      }
    }
  })

  const onSubmit = (formData: LoginFormFields) => {
    mutate({
      email: formData.email.trim(),
      password: formData.password
    })
  }

  return (
    <AnonymousLayout>
      {token ? (
        <div className="flex flex-col gap-4">
          <div className="text-black">
            Your 42 Finance account and all linked connections, accounts and transactions will be permanately deleted.
          </div>
          <Button type="primary" danger onClick={() => setShowDeleteAccount(true)} disabled={submittingDelete}>
            Delete Account
          </Button>
          <Button type="primary" onClick={() => setToken(null)} disabled={submittingDelete}>
            Logout
          </Button>
          <Dialog open={showDeleteAccount} onClose={() => setShowDeleteAccount(false)}>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? Account data cannot be recovered.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={() => setShowDeleteAccount(false)}>No</MuiButton>
              <LoadingButton onClick={() => deleteAccountMutation()} loading={submittingDelete}>
                Yes
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <LoginForm onSubmit={onSubmit} submitting={submitting} />
      )}
    </AnonymousLayout>
  )
}

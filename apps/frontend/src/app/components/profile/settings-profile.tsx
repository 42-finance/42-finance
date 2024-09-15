import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button as MuiButton
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ApiQuery,
  ChangePasswordRequest,
  EditUserRequest,
  changePassword,
  deleteUser,
  editUser,
  getUser
} from 'frontend-api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useDisplayContext } from '../../contexts/dark-mode.context'
import { useUserTokenContext } from '../../contexts/user-token.context'
import { Button } from '../common/button/button'
import { Card } from '../common/card/card'
import { ChangePasswordForm, ChangePasswordFormFields } from '../forms/change-password-form'
import { ProfileForm, ProfileFormFields } from '../forms/profile-form'
import { NotificationSettings } from '../notification-settings/notification-settings'

export const SettingsProfile = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { setToken, setCurrencyCode } = useUserTokenContext()
  const { displayPreference, setDisplayPreference } = useDisplayContext()

  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const { data: user, isFetching: fetchingUser } = useQuery({
    queryKey: [ApiQuery.User],
    queryFn: async () => {
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate: mutateProfile, isPending: submitting } = useMutation({
    mutationFn: async (request: EditUserRequest) => {
      const res = await editUser(request)
      if (res.ok) {
        toast.success('Your profile has been updated')
        if (request.currencyCode) {
          setCurrencyCode(request.currencyCode)
        }
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
      }
    }
  })

  const onSubmitProfile = (values: ProfileFormFields) => {
    mutateProfile(values)
  }

  const { mutate: changePasswordMutation, isPending: submittingChange } = useMutation({
    mutationFn: async (request: ChangePasswordRequest) => {
      const res = await changePassword(request)
      if (res.ok) {
        toast.success('Your password has been updated')
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
        queryClient.removeQueries()
        sessionStorage.removeItem('lastLocation')
        navigate('/login')
      }
    }
  })

  const onSubmitChange = (values: ChangePasswordFormFields) => {
    changePasswordMutation({
      currentPassword: values.currentPassword,
      newPassword: values.password
    })
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <Card title="Profile" className="mt-4">
        <div className="p-4">
          <ProfileForm profileInfo={user} onSubmit={onSubmitProfile} />
          <Button key="submit" form="profile-form" type="primary" htmlType="submit" disabled={submitting}>
            Update Profile
          </Button>
        </div>
      </Card>
      {/* <Card title="Preferences" className="mt-4">
        <div className="p-4">
          <label className="relative mb-1 flex items-center">Display Preference</label>
          <SelectInput
            options={Object.values(DisplayPreference).map((d) => ({ label: mapDisplayPreference(d), value: d }))}
            value={displayPreference}
            onChange={(value) => {
              if (value) {
                setDisplayPreference(value)
              }
            }}
          />
        </div>
      </Card> */}
      <NotificationSettings />
      <Card title="Change Password" className="mt-4">
        <div className="p-4">
          <ChangePasswordForm onSubmit={onSubmitChange} />
          <Button key="submit" form="change-password-form" type="primary" htmlType="submit" disabled={submittingChange}>
            Update Password
          </Button>
        </div>
      </Card>
      <Card title="Data" className="mt-4">
        <div className="p-4">
          <Button type="primary" danger onClick={() => setShowDeleteAccount(true)} disabled={submittingDelete}>
            Delete Account
          </Button>
        </div>
      </Card>
      <Dialog open={showDeleteAccount} onClose={() => setShowDeleteAccount(false)}>
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? Account data cannot be recovered
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
  )
}

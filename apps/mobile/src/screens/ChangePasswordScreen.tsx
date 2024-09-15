import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiQuery, ChangePasswordRequest, SetPasswordRequest, changePassword, getUser, setPassword } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { FlexLogo } from '../components/common/FlexLogo'
import { View } from '../components/common/View'
import { ChangePasswordForm, ChangePasswordFormFields } from '../components/forms/ChangePasswordForm'
import { SetPasswordForm, SetPasswordFormFields } from '../components/forms/SetPasswordForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const ChangePasswordScreen: React.FC<RootStackScreenProps<'ChangePassword'>> = ({ navigation }) => {
  const { data: user, isFetching: fetchingUser } = useQuery({
    queryKey: [ApiQuery.User],
    queryFn: async () => {
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate: changePasswordMutation, isPending: submittingChange } = useMutation({
    mutationFn: async (request: ChangePasswordRequest) => {
      Keyboard.dismiss()
      const res = await changePassword(request)
      if (res.ok) {
        setMessage('Your password has been updated')
        navigation.pop()
      }
    }
  })

  const onSubmitChange = (values: ChangePasswordFormFields) => {
    changePasswordMutation(values)
  }

  const { mutate: setPasswordMutation, isPending: submittingSet } = useMutation({
    mutationFn: async (request: SetPasswordRequest) => {
      Keyboard.dismiss()
      const res = await setPassword(request)
      if (res.ok) {
        setMessage('Your password has been set')
        navigation.pop()
      }
    }
  })

  const onSubmitSet = (values: SetPasswordFormFields) => {
    setPasswordMutation(values)
  }

  if (!user || fetchingUser) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <FlexLogo />
        {user.hasPassword ? (
          <ChangePasswordForm onSubmit={onSubmitChange} submitting={submittingChange} />
        ) : (
          <SetPasswordForm onSubmit={onSubmitSet} submitting={submittingSet} />
        )}
        <View
          style={{
            flex: 1,
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 0,
            justifyContent: 'flex-end',
            alignItems: 'stretch'
          }}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

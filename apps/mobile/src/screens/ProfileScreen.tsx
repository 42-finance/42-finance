import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiQuery, EditUserRequest, editUser, getUser } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { ProgressBar } from 'react-native-paper'

import { FlexLogo } from '../components/common/FlexLogo'
import { View } from '../components/common/View'
import { ProfileForm, ProfileFormFields } from '../components/forms/ProfileForm'
import { useUserTokenContext } from '../contexts/user-token.context'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const ProfileScreen: React.FC<RootStackScreenProps<'Profile'>> = () => {
  const { setCurrencyCode } = useUserTokenContext()

  const {
    data: user,
    isFetching: fetchingUser,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.User],
    queryFn: async () => {
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  useRefetchOnFocus(refetch)

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditUserRequest) => {
      Keyboard.dismiss()
      const res = await editUser(request)
      if (res.ok) {
        setMessage('Your profile has been updated')
        if (request.currencyCode) {
          setCurrencyCode(request.currencyCode)
        }
      }
    }
  })

  const onSubmit = (values: ProfileFormFields) => {
    mutate(values)
  }

  if (!user || fetchingUser) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <FlexLogo />
        <ProfileForm profileInfo={user} onSubmit={onSubmit} submitting={submitting} />
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

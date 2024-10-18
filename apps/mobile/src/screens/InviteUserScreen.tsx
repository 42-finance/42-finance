import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, InviteUserRequest, addUserInvite } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { InviteUserForm } from '../components/forms/InviteUserForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const InviteUserScreen = ({ navigation }: RootStackScreenProps<'InviteUser'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: InviteUserRequest) => {
      Keyboard.dismiss()
      const res = await addUserInvite(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.HouseholdUsers] })
        setMessage(
          'Successfully sent an invitation to the provided email. If they do not receive an email you can try inviting them again.'
        )
        navigation.pop()
      }
    }
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <InviteUserForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

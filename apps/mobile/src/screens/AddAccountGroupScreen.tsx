import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddAccountGroupRequest, ApiQuery, addAccountGroup } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { AccountGroupForm } from '../components/forms/AccountGroupForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddAccountGroupScreen = ({ navigation }: RootStackScreenProps<'AddAccountGroup'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddAccountGroupRequest) => {
      Keyboard.dismiss()
      const res = await addAccountGroup(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountGroups] })
        navigation.navigate('Accounts')
      }
    }
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <AccountGroupForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

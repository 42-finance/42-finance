import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddAccountRequest, ApiQuery, addAccount } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { AccountForm } from '../components/forms/AccountForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddAccountScreen = ({ navigation }: RootStackScreenProps<'AddAccount'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddAccountRequest) => {
      Keyboard.dismiss()
      const res = await addAccount(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        navigation.navigate('Accounts')
      }
    }
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <AccountForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

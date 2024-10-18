import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddGroupRequest, ApiQuery, addGroup } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { GroupForm } from '../components/forms/GroupForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddGroupScreen = ({ navigation }: RootStackScreenProps<'AddGroup'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddGroupRequest) => {
      Keyboard.dismiss()
      const res = await addGroup(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
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
        <GroupForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddTagRequest, ApiQuery, addTag } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { TagForm } from '../components/forms/TagForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddTagScreen = ({ navigation }: RootStackScreenProps<'AddTag'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddTagRequest) => {
      Keyboard.dismiss()
      const res = await addTag(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Tags] })
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
        <TagForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddCategoryRequest, ApiQuery, addCategory } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { CategoryForm } from '../components/forms/CategoryForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddCategoryScreen = ({ navigation }: RootStackScreenProps<'AddCategory'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddCategoryRequest) => {
      Keyboard.dismiss()
      const res = await addCategory(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
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
        <CategoryForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

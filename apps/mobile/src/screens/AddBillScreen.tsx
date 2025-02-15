import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddBillRequest, ApiQuery, addBill } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { BillForm } from '../components/forms/BillForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddBillScreen = ({ navigation }: RootStackScreenProps<'AddBill'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddBillRequest) => {
      Keyboard.dismiss()
      const res = await addBill(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Bills] })
        navigation.navigate('Bills')
      }
    }
  })

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <BillForm onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

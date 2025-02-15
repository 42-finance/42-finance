import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditBillRequest, editBill, getBill } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { BillForm } from '../components/forms/BillForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditBillScreen = ({ route, navigation }: RootStackScreenProps<'EditBill'>) => {
  const { billId } = route.params

  const queryClient = useQueryClient()

  const { data: bill } = useQuery({
    queryKey: [ApiQuery.Bill, billId],
    queryFn: async () => {
      const res = await getBill(billId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditBillRequest) => {
      Keyboard.dismiss()
      const res = await editBill(billId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Bill] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Bills] })
        navigation.pop()
      }
    }
  })

  if (!bill) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <BillForm billInfo={bill} onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

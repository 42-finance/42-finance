import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddAccountRequest, ApiQuery, addAccount } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { AccountSubType, AccountType } from 'shared-types'

import { VehicleForm, VehicleFormFields } from '../components/forms/VehicleForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddVehicleScreen = ({ navigation }: RootStackScreenProps<'AddVehicle'>) => {
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

  const onSubmit = (values: VehicleFormFields) => {
    mutate({
      name: values.name,
      type: AccountType.Asset,
      subType: AccountSubType.Vehicle,
      currentBalance: values.currentBalance,
      vehicleVin: values.vehicleVin,
      vehicleMileage: values.vehicleMileage,
      currencyCode: values.currencyCode
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1
        }}
      >
        <VehicleForm onSubmit={onSubmit} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

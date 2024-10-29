import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddAccountRequest, ApiQuery, addAccount } from 'frontend-api'
import * as React from 'react'
import { Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AccountSubType, AccountType } from 'shared-types'

import { PropertyForm, PropertyFormFields } from '../components/forms/PropertyForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddPropertyScreen = ({ navigation }: RootStackScreenProps<'AddProperty'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddAccountRequest) => {
      Keyboard.dismiss()
      const res = await addAccount(request)
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        navigation.navigate('Accounts')
      }
    }
  })

  const onSubmit = (values: PropertyFormFields) => {
    mutate({
      name: values.name,
      propertyAddress: values.propertyAddress,
      currentBalance: values.currentBalance,
      type: AccountType.Asset,
      subType: AccountSubType.Property,
      currencyCode: values.currencyCode,
      hideFromAccountsList: false,
      hideFromNetWorth: false,
      hideFromBudget: false
    })
  }

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" style={{ marginTop: 5 }}>
      <PropertyForm onSubmit={onSubmit} submitting={submitting} />
    </KeyboardAwareScrollView>
  )
}

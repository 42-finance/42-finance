import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddAccountRequest, ApiQuery, addAccount } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { AccountSubType, AccountType, CurrencyCode } from 'shared-types'

import { CryptoForm, CryptoFormFields } from '../components/forms/CryptoForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddCryptoScreen = ({ navigation }: RootStackScreenProps<'AddCrypto'>) => {
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

  const onSubmit = (values: CryptoFormFields) => {
    mutate({
      name: values.name,
      type: AccountType.Asset,
      subType: AccountSubType.CryptoExchange,
      currentBalance: 0,
      walletType: values.walletType,
      walletAddress: values.walletAddress,
      currencyCode: CurrencyCode.USD,
      hideFromAccountsList: false,
      hideFromNetWorth: false,
      hideFromBudget: false
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
        <CryptoForm onSubmit={onSubmit} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

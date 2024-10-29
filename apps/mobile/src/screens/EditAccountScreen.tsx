import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditAccountRequest, editAccount, getAccount } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { AccountForm } from '../components/forms/AccountForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditAccountScreen = ({ route, navigation }: RootStackScreenProps<'EditAccount'>) => {
  const { accountId } = route.params

  const queryClient = useQueryClient()

  const { data: account } = useQuery({
    queryKey: [ApiQuery.Account, accountId],
    queryFn: async () => {
      const res = await getAccount(accountId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditAccountRequest) => {
      Keyboard.dismiss()
      const res = await editAccount(accountId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Account] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Accounts] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountGroups] })
        navigation.pop()
      }
    }
  })

  if (!account) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <AccountForm
          accountInfo={{ ...account, convertBalanceCurrency: true }}
          onSubmit={mutate}
          submitting={submitting}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

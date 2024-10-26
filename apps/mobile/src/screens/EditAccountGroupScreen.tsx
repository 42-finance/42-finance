import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditAccountGroupRequest, editAccountGroup, getAccountGroup } from 'frontend-api'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { AccountGroupForm } from '../components/forms/AccountGroupForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditAccountGroupScreen = ({ route, navigation }: RootStackScreenProps<'EditAccountGroup'>) => {
  const { accountGroupId } = route.params

  const queryClient = useQueryClient()

  const { data: accountGroup } = useQuery({
    queryKey: [ApiQuery.AccountGroup, accountGroupId],
    queryFn: async () => {
      const res = await getAccountGroup(accountGroupId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditAccountGroupRequest) => {
      Keyboard.dismiss()
      const res = await editAccountGroup(accountGroupId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountGroup] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountGroups] })
        navigation.pop()
      }
    }
  })

  if (!accountGroup) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <AccountGroupForm accountGroupInfo={accountGroup} onSubmit={mutate} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

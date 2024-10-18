import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddGoalRequest, ApiQuery, addGoal } from 'frontend-api'
import * as React from 'react'
import { Keyboard } from 'react-native'

import { GoalForm, GoalFormFields, TargetType } from '../components/forms/GoalForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddGoalScreen = ({ navigation }: RootStackScreenProps<'AddGoal'>) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddGoalRequest) => {
      Keyboard.dismiss()
      const res = await addGoal(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Goals] })
        navigation.pop()
      }
    }
  })

  const onSubmit = (values: GoalFormFields) => {
    mutate({
      name: values.name,
      amount: values.amount,
      accountIds: values.accounts.map((a) => a.id),
      type: values.type,
      targetDate: values.targetType === TargetType.Date ? values.targetDate : null,
      budgetAmount: values.targetType === TargetType.Amount ? values.budgetAmount : null
    })
  }

  return <GoalForm onSubmit={onSubmit} submitting={submitting} />
}

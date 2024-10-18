import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditGoalRequest, deleteGoal, editGoal, getGoal } from 'frontend-api'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { Button, Dialog, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'
import { GoalType } from 'shared-types'

import { GoalForm, GoalFormFields, TargetType } from '../components/forms/GoalForm'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditGoalScreen = ({ route, navigation }: RootStackScreenProps<'EditGoal'>) => {
  const { goalId } = route.params

  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const showActionSheet = useActionSheet()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { data: goal } = useQuery({
    queryKey: [ApiQuery.Goal, goalId],
    queryFn: async () => {
      const res = await getGoal(goalId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditGoalRequest) => {
      Keyboard.dismiss()
      const res = await editGoal(goalId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Goals] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Goal] })
        navigation.pop()
      }
    }
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteGoal(goalId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Goals] })
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
      startDate: values.startDate,
      targetDate: values.type === GoalType.Spending || values.targetType === TargetType.Date ? values.targetDate : null,
      budgetAmount: values.targetType === TargetType.Amount ? values.budgetAmount : null
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Delete goal',
                onSelected: () => {
                  setDeleteDialogVisible(true)
                },
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation, showActionSheet])

  if (!goal || submittingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Goal</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this goal?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <GoalForm goalInfo={goal} onSubmit={onSubmit} submitting={submitting} />
    </>
  )
}

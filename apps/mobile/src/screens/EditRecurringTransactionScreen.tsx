import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { startOfDay } from 'date-fns'
import {
  ApiQuery,
  EditRecurringTransactionRequest,
  deleteRecurringTransaction,
  editRecurringTransaction,
  getRecurringTransaction
} from 'frontend-api'
import { dateToLocal, dateToUtc } from 'frontend-utils'
import _ from 'lodash'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { Button, Dialog, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'
import { CategoryType } from 'shared-types'

import { RecurringTransactionForm, RecurringTransactionFormFields } from '../components/forms/RecurringTransactionForm'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditRecurringTransactionScreen = ({
  route,
  navigation
}: RootStackScreenProps<'EditRecurringTransaction'>) => {
  const { recurringTransactionId } = route.params

  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const showActionSheet = useActionSheet()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { data: recurringTransaction } = useQuery({
    queryKey: [ApiQuery.RecurringTransaction, recurringTransactionId],
    queryFn: async () => {
      const res = await getRecurringTransaction(recurringTransactionId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditRecurringTransactionRequest) => {
      Keyboard.dismiss()
      const res = await editRecurringTransaction(recurringTransactionId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.RecurringTransaction] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.RecurringTransactions] })
        navigation.pop()
      }
    }
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteRecurringTransaction(recurringTransactionId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.RecurringTransaction] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.RecurringTransactions] })
        navigation.pop()
      }
    }
  })

  const onSubmit = (values: RecurringTransactionFormFields) => {
    mutate({
      name: values.name,
      startDate: dateToUtc(startOfDay(values.startDate)),
      frequency: values.frequency,
      interval: values.interval,
      amount: values.type === CategoryType.Expense ? values.amount : -values.amount,
      type: values.type,
      accountId: values.account?.id as string,
      merchantId: values.merchant?.id as number
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Delete recurring',
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

  if (!recurringTransaction || submittingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Recurring</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this recurring transactions?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <RecurringTransactionForm
        transactionInfo={{
          ...recurringTransaction,
          name: _.isEmpty(recurringTransaction.name) ? recurringTransaction.merchant.name : recurringTransaction.name,
          startDate: dateToLocal(recurringTransaction.startDate)
        }}
        onSubmit={onSubmit}
        submitting={submitting}
      />
    </>
  )
}

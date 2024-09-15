import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startOfDay } from 'date-fns'
import { AddRecurringTransactionRequest, ApiQuery, addRecurringTransaction } from 'frontend-api'
import { dateToUtc } from 'frontend-utils'
import React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import { CategoryType, Frequency } from 'shared-types'

import { RecurringTransactionForm, RecurringTransactionFormFields } from '../components/forms/RecurringTransactionForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddRecurringTransactionScreen: React.FC<RootStackScreenProps<'AddRecurringTransaction'>> = ({
  navigation,
  route
}) => {
  const { transactionId, startDate, amount, type, account, merchant } = route.params

  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddRecurringTransactionRequest) => {
      const res = await addRecurringTransaction(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.RecurringTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
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
      merchantId: values.merchant?.id as number,
      transactionIds: transactionId ? [transactionId] : []
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
        <RecurringTransactionForm
          transactionInfo={
            {
              name: merchant?.name ?? null,
              startDate: startDate ? new Date(startDate) : null,
              frequency: Frequency.MonthlyExactDay,
              interval: null,
              amount: amount != null ? Math.abs(amount) : null,
              type,
              account,
              merchant
            } as RecurringTransactionFormFields
          }
          onSubmit={onSubmit}
          submitting={submitting}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

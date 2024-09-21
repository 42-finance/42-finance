import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startOfDay } from 'date-fns'
import { AddTransactionRequest, ApiQuery, addTransaction } from 'frontend-api'
import { dateToUtc } from 'frontend-utils'
import React from 'react'
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'

import { TransactionForm, TransactionFormFields } from '../components/forms/TransactionForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddTransactionScreen: React.FC<RootStackScreenProps<'AddTransaction'>> = ({ navigation }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddTransactionRequest) => {
      const res = await addTransaction(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.AccountTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.BudgetTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.CashFlowTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.CategoryTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.DashboardTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.GroupTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.MerchantTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.SpendingTransactions] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transactions] })
        navigation.pop()
      }
    }
  })

  const onSubmit = (values: TransactionFormFields) => {
    mutate({
      date: dateToUtc(startOfDay(values.date)),
      amount: values.type === 'debit' ? values.amount : -values.amount,
      accountId: values.account?.id ?? '',
      categoryId: values.category?.id ?? 0,
      merchantName: values.merchantName
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
        <TransactionForm onSubmit={onSubmit} submitting={submitting} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

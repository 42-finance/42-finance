import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddRuleRequest, ApiQuery, addRule } from 'frontend-api'
import * as React from 'react'
import { Keyboard } from 'react-native'
import { NameFilter } from 'shared-types'

import { RuleForm, RuleFormFields } from '../components/forms/RuleForm'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const AddRuleScreen = ({ navigation, route }: RootStackScreenProps<'AddRule'>) => {
  const { merchantName, newCategory } = route.params

  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddRuleRequest) => {
      Keyboard.dismiss()
      const res = await addRule(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Rules] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        navigation.pop()
      }
    }
  })

  const onSubmit = (values: RuleFormFields) => {
    mutate({
      merchantValueFilter: values.merchant.merchantValueFilter,
      merchantName: values.merchant.merchantName,
      merchantOriginalStatement: values.merchant.merchantOriginalStatement,
      amountType: values.amount.amountType,
      amountFilterType: values.amount.amountFilterType,
      amountValue: values.amount.amountValue,
      amountValue2: values.amount.amountValue2,
      categoryId: values.category?.id ?? null,
      accountId: values.account?.id ?? null,
      newMerchantName: values.newMerchantName,
      newCategoryId: values.newCategory?.id ?? null,
      hideTransaction: values.hideTransaction,
      needsReview: values.needsReview,
      priority: values.priority,
      applyToExisting: values.applyToExisting ?? false
    })
  }

  return (
    <RuleForm
      ruleInfo={
        {
          merchant: {
            merchantValueFilter: merchantName ? NameFilter.Matches : null,
            merchantName
          },
          newCategory
        } as RuleFormFields
      }
      onSubmit={onSubmit}
      submitting={submitting}
    />
  )
}

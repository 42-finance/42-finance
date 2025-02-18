import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditRuleRequest, deleteRule, editRule, getRule } from 'frontend-api'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { Button, Dialog, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'

import { RuleForm, RuleFormFields } from '../components/forms/RuleForm'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditRuleScreen = ({ route, navigation }: RootStackScreenProps<'EditRule'>) => {
  const { ruleId } = route.params

  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const showActionSheet = useActionSheet()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { data: rule } = useQuery({
    queryKey: [ApiQuery.Rule, ruleId],
    queryFn: async () => {
      const res = await getRule(ruleId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditRuleRequest) => {
      Keyboard.dismiss()
      const res = await editRule(ruleId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Rules] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Rule] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        navigation.pop()
      }
    }
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteRule(ruleId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Rules] })
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Delete rule',
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

  if (!rule || submittingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Rule</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this rule?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <RuleForm
        ruleInfo={{
          ...rule,
          amount: {
            amountType: rule.amountType,
            amountFilterType: rule.amountFilterType,
            amountValue: rule.amountValue,
            amountValue2: rule.amountValue2
          },
          merchant: {
            merchantValueFilter: rule.merchantValueFilter,
            merchantName: rule.merchantName,
            merchantOriginalStatement: rule.merchantOriginalStatement
          }
        }}
        onSubmit={onSubmit}
        submitting={submitting}
      />
    </>
  )
}

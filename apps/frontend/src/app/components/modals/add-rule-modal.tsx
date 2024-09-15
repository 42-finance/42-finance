import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AddRuleRequest, ApiQuery, addRule } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'
import { NameFilter } from 'shared-types'

import { Button } from '../common/button/button'
import { Modal } from '../common/modal/modal'
import { RuleForm, RuleFormFields } from '../forms/rule-form'

type Props = {
  onClose: () => void
  merchantName?: string
  newCategoryId?: number
}

export const AddRuleModal: React.FC<Props> = ({ onClose, merchantName, newCategoryId }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: AddRuleRequest) => {
      const res = await addRule(request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Rules] })
        toast.success('Rule added')
        onClose()
      }
    }
  })

  const onSubmit = (values: RuleFormFields) => {
    mutate({
      merchantValueFilter: values.merchantValueFilter,
      merchantName: values.merchantType === 'name' ? values.merchantName : null,
      merchantOriginalStatement: values.merchantType === 'statement' ? values.merchantOriginalStatement : null,
      amountType: values.amountType,
      amountFilterType: values.amountFilterType,
      amountValue: values.amountValue,
      amountValue2: values.amountValue2,
      categoryId: values.categoryId ?? null,
      accountId: values.accountId ?? null,
      newMerchantName: values.newMerchantName,
      newCategoryId: values.newCategoryId ?? null,
      hideTransaction: values.hideTransaction,
      needsReview: values.needsReview,
      applyToExisting: values.applyToExisting
    })
  }

  return (
    <Modal
      title="Add Rule"
      onClose={onClose}
      maxWidth="max-w-[50rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="rule-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      <RuleForm
        onSubmit={onSubmit}
        ruleInfo={
          {
            merchantType: merchantName ? 'name' : null,
            merchantValueFilter: merchantName ? NameFilter.Matches : null,
            merchantName,
            newCategoryId,
            applyToExisting: false
          } as RuleFormFields
        }
      />
    </Modal>
  )
}

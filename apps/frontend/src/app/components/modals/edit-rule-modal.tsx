import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditRuleRequest, editRule, getRule } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { RuleForm, RuleFormFields } from '../forms/rule-form'

type Props = {
  onClose: () => void
  ruleId: number
}

export const EditRuleModal: React.FC<Props> = ({ onClose, ruleId }) => {
  const queryClient = useQueryClient()

  const { data: rule } = useQuery({
    queryKey: [ApiQuery.Rule, ruleId],
    queryFn: async () => {
      const res = await getRule(ruleId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return null
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditRuleRequest) => {
      const res = await editRule(ruleId, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Rule] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Rules] })
        toast.success('Rule updated')
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
      title="Edit Rule"
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
      {!rule && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {rule && (
        <RuleForm
          onSubmit={onSubmit}
          ruleInfo={{
            ...rule,
            merchantType: rule.merchantName ? 'name' : rule.merchantOriginalStatement ? 'statement' : null,
            applyToExisting: false
          }}
        />
      )}
    </Modal>
  )
}

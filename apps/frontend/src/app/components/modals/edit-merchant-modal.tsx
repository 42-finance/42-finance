import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditMerchantRequest, editMerchant, getMerchant } from 'frontend-api'
import React from 'react'
import { toast } from 'react-toastify'

import { Button } from '../common/button/button'
import { Loader } from '../common/loader/loader'
import { Modal } from '../common/modal/modal'
import { MerchantForm, MerchantFormFields } from '../forms/merchant-form'

type Props = {
  onClose: () => void
  merchantId: number
}

export const EditMerchantModal: React.FC<Props> = ({ merchantId, onClose }) => {
  const queryClient = useQueryClient()

  const { data: merchant } = useQuery({
    queryKey: [ApiQuery.Merchant, merchantId],
    queryFn: async () => {
      const res = await getMerchant(merchantId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditMerchantRequest) => {
      const res = await editMerchant(merchantId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Merchants] })
        toast.success('Merchant updated')
        onClose()
      }
    }
  })

  const onSubmit = (formData: MerchantFormFields) => {
    mutate(formData)
  }

  return (
    <Modal
      title="Edit Merchant"
      onClose={onClose}
      maxWidth="max-w-[25rem]"
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" form="merchant-form" type="primary" htmlType="submit" disabled={submitting}>
          Submit
        </Button>
      ]}
    >
      {!merchant && (
        <div className="relative h-44">
          <Loader />
        </div>
      )}
      {merchant && <MerchantForm onSubmit={onSubmit} merchantInfo={merchant} />}
    </Modal>
  )
}

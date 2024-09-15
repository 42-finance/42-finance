import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'

export type MerchantFormFields = {
  name: string
}

type Props = {
  merchantInfo: MerchantFormFields | null
  onSubmit: SubmitHandler<MerchantFormFields>
}

export const MerchantForm: React.FC<Props> = ({ onSubmit, merchantInfo }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<MerchantFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: merchantInfo?.name ?? ''
    }
  })

  return (
    <form
      id="merchant-form"
      data-testid="merchant-form"
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
      </div>
    </form>
  )
}

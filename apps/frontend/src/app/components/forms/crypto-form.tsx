import { yupResolver } from '@hookform/resolvers/yup'
import { mapWalletType } from 'frontend-utils'
import React, { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { WalletType } from 'shared-types'
import * as Yup from 'yup'

import { FormInput } from '../common/form/form-input'
import { FormSelect } from '../common/form/form-select'

export type CryptoFormFields = {
  name: string
  walletType: WalletType
  walletAddress: string
}

type Props = {
  cryptoInfo?: CryptoFormFields
  onSubmit: SubmitHandler<CryptoFormFields>
}

export const CryptoForm: React.FC<Props> = ({ onSubmit, cryptoInfo }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    walletType: Yup.mixed<WalletType>().required('Wallet type is required'),
    walletAddress: Yup.string().required('Wallet address is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<CryptoFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: cryptoInfo?.name ?? '',
      walletType: cryptoInfo?.walletType ?? WalletType.Ethereum,
      walletAddress: cryptoInfo?.walletAddress ?? ''
    }
  })

  const walletTypes = useMemo(() => Object.values(WalletType).map((c) => ({ label: mapWalletType(c), value: c })), [])

  return (
    <form id="crypto-form" data-testid="crypto-form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-x-6 md:grid-cols-2">
        <div>
          <FormInput control={control} errors={errors.name?.message} label="Name" name="name" type="text" />
        </div>
        <div>
          <FormSelect
            control={control}
            errors={errors.walletType?.message}
            label="Wallet Type"
            name="walletType"
            options={walletTypes}
          />
        </div>
        <div>
          <FormInput
            control={control}
            errors={errors.walletAddress?.message}
            label="Wallet Address"
            name="walletAddress"
            type="text"
          />
        </div>
      </div>
    </form>
  )
}

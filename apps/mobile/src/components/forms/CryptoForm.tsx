import { yupResolver } from '@hookform/resolvers/yup'
import { mapWalletType } from 'frontend-utils/src/mappers/map-wallet-type'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { WalletType } from 'shared-types'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type CryptoFormFields = {
  name: string
  walletType: WalletType
  walletAddress: string
}

type Props = {
  cryptoInfo?: CryptoFormFields
  onSubmit: (values: CryptoFormFields) => void
  submitting: boolean
}

export const CryptoForm: React.FC<Props> = ({ cryptoInfo, onSubmit, submitting }) => {
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
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.name}
      />
      <PaperPickerField
        label="Wallet Type"
        name="walletType"
        control={control}
        items={walletTypes}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.walletType}
      />
      <TextInput
        label="Wallet Address"
        name="walletAddress"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.walletAddress}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Crypto Account
      </Button>
    </View>
  )
}

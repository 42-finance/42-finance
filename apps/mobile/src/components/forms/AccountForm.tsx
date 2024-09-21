import { yupResolver } from '@hookform/resolvers/yup'
import { mapAccountSubType } from 'frontend-utils/src/mappers/map-account-sub-type'
import { mapAccountType } from 'frontend-utils/src/mappers/map-account-type'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { AccountSubType, AccountType, CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/CurrencyInput'
import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type AccountFormFields = {
  name: string
  type: AccountType
  subType: AccountSubType
  currentBalance: number
  currencyCode: CurrencyCode
}

type Props = {
  accountInfo?: AccountFormFields
  onSubmit: (values: AccountFormFields) => void
  submitting: boolean
}

export const AccountForm: React.FC<Props> = ({ accountInfo, onSubmit, submitting }) => {
  const { currencyCode } = useUserTokenContext()

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.mixed<AccountType>().required('Type is required'),
    subType: Yup.mixed<AccountSubType>().required('Subtype is required'),
    currentBalance: Yup.number().required('Balance is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<AccountFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: accountInfo?.name ?? '',
      type: accountInfo?.type ?? AccountType.Asset,
      subType: accountInfo?.subType ?? AccountSubType.Other,
      currentBalance: accountInfo?.currentBalance ?? 0,
      currencyCode: accountInfo?.currencyCode ?? currencyCode
    }
  })

  const accountTypes = useMemo(
    () => Object.values(AccountType).map((c) => ({ label: mapAccountType(c), value: c })),
    []
  )

  const accountSubTypes = useMemo(
    () =>
      Object.values(AccountSubType)
        .sort()
        .map((c) => ({ label: mapAccountSubType(c), value: c })),
    []
  )

  const currencyCodes = useMemo(
    () =>
      Object.values(CurrencyCode)
        .sort()
        .map((c) => ({ label: c, value: c })),
    []
  )

  const currencyCurrencyCode = watch('currencyCode')

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
        label="Type"
        name="type"
        control={control}
        items={accountTypes}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.type}
      />
      <PaperPickerField
        label="Subtype"
        name="subType"
        control={control}
        items={accountSubTypes}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.subType}
      />
      <CurrencyInput
        label="Balance"
        name="currentBalance"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.currentBalance}
        currencyCode={currencyCurrencyCode}
      />
      <PaperPickerField
        label="Currency"
        name="currencyCode"
        control={control}
        items={currencyCodes}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.currencyCode}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Account
      </Button>
    </View>
  )
}

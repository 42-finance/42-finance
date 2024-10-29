import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getAccountGroups } from 'frontend-api'
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
  accountGroupId: number | null
  hideFromAccountsList: boolean
  hideFromNetWorth: boolean
  hideFromBudget: boolean
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
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required'),
    accountGroupId: Yup.number().defined().nullable(),
    hideFromAccountsList: Yup.boolean().required('Hide from accounts list is required'),
    hideFromNetWorth: Yup.boolean().required('Hide from net worth is required'),
    hideFromBudget: Yup.boolean().required('Hide from budget is required')
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
      currencyCode: accountInfo?.currencyCode ?? currencyCode,
      accountGroupId: accountInfo?.accountGroupId ?? null,
      hideFromAccountsList: accountInfo?.hideFromAccountsList ?? false,
      hideFromNetWorth: accountInfo?.hideFromNetWorth ?? false,
      hideFromBudget: accountInfo?.hideFromBudget ?? false
    }
  })

  const { data: accountGroups = [] } = useQuery({
    queryKey: [ApiQuery.AccountGroups],
    queryFn: async () => {
      const res = await getAccountGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
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

  const accountGroupItems = useMemo(
    () => [{ label: 'None', value: null }, ...accountGroups.map((a) => ({ label: a.name, value: a.id }))],
    []
  )

  const yesNoItems = useMemo(
    () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
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
      <PaperPickerField
        label="Account Group"
        name="accountGroupId"
        control={control}
        items={accountGroupItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.accountGroupId}
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
      <PaperPickerField
        label="Hide from accounts list"
        name="hideFromAccountsList"
        control={control}
        items={yesNoItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.hideFromAccountsList}
      />
      <PaperPickerField
        label="Hide from net worth"
        name="hideFromNetWorth"
        control={control}
        items={yesNoItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.hideFromNetWorth}
      />
      <PaperPickerField
        label="Hide from budget"
        name="hideFromBudget"
        control={control}
        items={yesNoItems}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.hideFromBudget}
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

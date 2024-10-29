import { yupResolver } from '@hookform/resolvers/yup'
import { mapAccountGroupType } from 'frontend-utils'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { AccountGroupType } from 'shared-types'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type AccountGroupFormFields = {
  name: string
  type: AccountGroupType
  hideFromAccountsList: boolean
  hideFromNetWorth: boolean
  hideFromBudget: boolean
}

type Props = {
  accountGroupInfo?: AccountGroupFormFields
  onSubmit: (values: AccountGroupFormFields) => void
  submitting: boolean
}

export const AccountGroupForm: React.FC<Props> = ({ accountGroupInfo, onSubmit, submitting }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.mixed<AccountGroupType>().required('Type is required'),
    hideFromAccountsList: Yup.boolean().required('Hide from accounts list is required'),
    hideFromNetWorth: Yup.boolean().required('Hide from net worth is required'),
    hideFromBudget: Yup.boolean().required('Hide from budget is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<AccountGroupFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: accountGroupInfo?.name ?? '',
      type: accountGroupInfo?.type ?? AccountGroupType.OtherAssets,
      hideFromAccountsList: accountGroupInfo?.hideFromAccountsList ?? false,
      hideFromNetWorth: accountGroupInfo?.hideFromNetWorth ?? false,
      hideFromBudget: accountGroupInfo?.hideFromBudget ?? false
    }
  })

  const accountGroupTypes = useMemo(
    () => Object.values(AccountGroupType).map((a) => ({ label: mapAccountGroupType(a), value: a })),
    []
  )

  const yesNoItems = useMemo(
    () => [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ],
    []
  )

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
        items={accountGroupTypes}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.type}
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
        Save Account Group
      </Button>
    </View>
  )
}

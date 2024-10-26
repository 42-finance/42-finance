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
}

type Props = {
  accountGroupInfo?: AccountGroupFormFields
  onSubmit: (values: AccountGroupFormFields) => void
  submitting: boolean
}

export const AccountGroupForm: React.FC<Props> = ({ accountGroupInfo, onSubmit, submitting }) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.mixed<AccountGroupType>().required('Type is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<AccountGroupFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: accountGroupInfo?.name ?? '',
      type: accountGroupInfo?.type ?? AccountGroupType.Other
    }
  })

  const accountGroupTypes = useMemo(
    () => Object.values(AccountGroupType).map((a) => ({ label: mapAccountGroupType(a), value: a })),
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

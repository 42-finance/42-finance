import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import * as Yup from 'yup'

import { TextInput } from '../common/TextInput'

export type MerchantFormFields = {
  name: string
}

type Props = {
  merchantInfo?: MerchantFormFields
  onSubmit: (values: MerchantFormFields) => void
  submitting: boolean
}

export const MerchantForm: React.FC<Props> = ({ merchantInfo, onSubmit, submitting }) => {
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
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, marginTop: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Save Merchant
      </Button>
    </View>
  )
}

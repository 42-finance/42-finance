import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'
import { View } from '../common/View'

export type ProfileFormFields = {
  name: string
  email: string
  phone: string | null
  currencyCode: CurrencyCode
}

type Props = {
  profileInfo?: ProfileFormFields
  onSubmit: (values: ProfileFormFields) => void
  submitting: boolean
}

export const ProfileForm: React.FC<Props> = ({ profileInfo, onSubmit, submitting }) => {
  const phoneInput = useRef<any>()

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    phone: Yup.string().nullable().defined(),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<ProfileFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: profileInfo?.name ?? '',
      email: profileInfo?.email ?? '',
      phone: profileInfo?.phone ?? null,
      currencyCode: profileInfo?.currencyCode ?? CurrencyCode.USD
    }
  })

  const currencyItems = useMemo(
    () =>
      Object.values(CurrencyCode).map((c) => ({
        label: c,
        value: c
      })),
    []
  )

  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        onSubmitEditing={() => {
          phoneInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.name}
      />
      <TextInput label="Email" name="email" control={control} style={styles.input} disabled />
      <TextInput
        label="Phone"
        name="phone"
        control={control}
        style={styles.input}
        forwardRef={phoneInput}
        keyboardType="number-pad"
      />
      <PaperPickerField
        label="Currency"
        name="currencyCode"
        control={control}
        items={currencyItems}
        style={styles.input}
        error={errors.currencyCode}
      />
      <Button
        mode="contained"
        style={{ marginHorizontal: 5, alignSelf: 'stretch' }}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
        loading={submitting}
      >
        Update Profile
      </Button>
    </View>
  )
}

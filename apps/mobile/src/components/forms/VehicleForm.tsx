import { yupResolver } from '@hookform/resolvers/yup'
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { View } from 'react-native'
import { Button, TextInput as PaperTextInput } from 'react-native-paper'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/CurrencyInput'
import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type VehicleFormFields = {
  name: string
  vehicleVin: string | null
  vehicleMileage: number | null
  currentBalance: number
  currencyCode: CurrencyCode
}

type Props = {
  vehicleInfo?: VehicleFormFields
  onSubmit: (values: VehicleFormFields) => void
  submitting: boolean
}

export const VehicleForm: React.FC<Props> = ({ vehicleInfo, onSubmit, submitting }) => {
  const { currencyCode } = useUserTokenContext()

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    vehicleVin: Yup.string().nullable().defined(),
    vehicleMileage: Yup.number().nullable().defined(),
    currentBalance: Yup.number().required('Vehicle value is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<VehicleFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: vehicleInfo?.name ?? '',
      vehicleVin: vehicleInfo?.vehicleVin ?? null,
      vehicleMileage: vehicleInfo?.vehicleMileage ?? null,
      currentBalance: vehicleInfo?.currentBalance ?? 0,
      currencyCode: vehicleInfo?.currencyCode ?? currencyCode
    }
  })

  const currencyCodes = useMemo(
    () =>
      Object.values(CurrencyCode)
        .sort()
        .map((c) => ({ label: c, value: c })),
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
      <TextInput
        label="VIN (Optional)"
        name="vehicleVin"
        control={control}
        returnKeyType="next"
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.vehicleVin}
      />
      <TextInput
        label="Mileage (Optional)"
        name="vehicleMileage"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.vehicleMileage}
        right={<PaperTextInput.Affix text="mi" />}
        keyboardType="number-pad"
      />
      <CurrencyInput
        label="Vehicle Value"
        name="currentBalance"
        control={control}
        style={{
          marginTop: 5,
          marginHorizontal: 5
        }}
        error={errors.currentBalance}
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
        Save Vehicle
      </Button>
    </View>
  )
}

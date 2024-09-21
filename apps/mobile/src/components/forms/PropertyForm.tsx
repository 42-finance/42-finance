import { yupResolver } from '@hookform/resolvers/yup'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { autocompleteAddress } from 'frontend-api'
import { useDebounce } from 'frontend-utils/src/hooks/use-debounce.hook'
import React, { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { CurrencyCode } from 'shared-types'
import * as Yup from 'yup'

import { useUserTokenContext } from '../../contexts/user-token.context'
import { CurrencyInput } from '../common/CurrencyInput'
import { PaperPickerField } from '../common/PaperPickerField'
import { TextInput } from '../common/TextInput'

export type PropertyFormFields = {
  name: string
  propertyAddress: string | null
  currentBalance: number
  currencyCode: CurrencyCode
}

type Props = {
  propertyInfo?: PropertyFormFields
  onSubmit: (values: PropertyFormFields) => void
  submitting: boolean
}

export const PropertyForm: React.FC<Props> = ({ propertyInfo, onSubmit, submitting }) => {
  const { colors } = useTheme()
  const { currencyCode } = useUserTokenContext()

  const [address, setAddress] = useDebounce('', 500)
  const [showPredictions, setShowPredictions] = useState(false)

  const addressInput = useRef<any>()
  const balanceInput = useRef<any>()

  const styles = StyleSheet.create({
    input: {
      marginBottom: 5,
      marginHorizontal: 5
    }
  })

  const { data: predictions = [] } = useQuery({
    queryKey: ['AutoComplete', address],
    queryFn: async () => {
      if (address.length > 4) {
        const res = await autocompleteAddress(address)
        if (res.ok && res.parsedBody?.predictions) {
          return res.parsedBody.predictions
        }
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    propertyAddress: Yup.string().nullable().defined(),
    currentBalance: Yup.number().required('Property value is required'),
    currencyCode: Yup.mixed<CurrencyCode>().required('Currency is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<PropertyFormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: propertyInfo?.name ?? '',
      propertyAddress: propertyInfo?.propertyAddress ?? null,
      currentBalance: propertyInfo?.currentBalance ?? 0,
      currencyCode: propertyInfo?.currencyCode ?? currencyCode
    }
  })

  const currencyCodes = useMemo(
    () =>
      Object.values(CurrencyCode)
        .sort()
        .map((c) => ({ label: c, value: c })),
    []
  )

  const currentCurrencyCode = watch('currencyCode')

  return (
    <View>
      <TextInput
        label="Name"
        name="name"
        control={control}
        returnKeyType="next"
        onSubmitEditing={() => {
          addressInput?.current?.focus()
        }}
        style={styles.input}
        error={errors.name}
      />
      <TextInput
        label="Address (Optional)"
        name="propertyAddress"
        control={control}
        onChangeText={(value) => {
          setAddress(value)
        }}
        forwardRef={addressInput}
        returnKeyType="next"
        onSubmitEditing={() => {
          balanceInput?.current?.focus()
        }}
        onFocus={() => {
          setShowPredictions(true)
        }}
        style={styles.input}
        error={errors.propertyAddress}
      />
      {showPredictions && (
        <View
          style={{
            marginHorizontal: 5,
            position: 'absolute',
            zIndex: 100,
            backgroundColor: colors.background,
            top: 120,
            left: 0,
            right: 0
          }}
        >
          {predictions.map((prediction) => (
            <TouchableOpacity
              key={prediction.place_id}
              onPress={async () => {
                addressInput.current?.blur()
                setShowPredictions(false)
                setValue('propertyAddress', prediction.description)
              }}
            >
              <Text style={{ margin: 15 }}>{prediction.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <CurrencyInput
        label="Property Value"
        name="currentBalance"
        control={control}
        forwardRef={balanceInput}
        style={styles.input}
        error={errors.currentBalance}
        currencyCode={currentCurrencyCode}
      />
      <PaperPickerField
        label="Currency"
        name="currencyCode"
        control={control}
        items={currencyCodes}
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
        Save Property
      </Button>
    </View>
  )
}

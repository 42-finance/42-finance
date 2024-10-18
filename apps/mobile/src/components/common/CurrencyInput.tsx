import { getCurrencySymbol } from 'frontend-utils'
import React from 'react'
import { Control, Controller, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { ReturnKeyTypeOptions, StyleProp, TextStyle } from 'react-native'
import NativeCurrencyInput from 'react-native-currency-input'
import { TextInput as PaperTextInput } from 'react-native-paper'
import { CurrencyCode } from 'shared-types'

import { ErrorText } from './ErrorText'

type Props<FormFields extends FieldValues> = {
  label: string
  name: FieldPath<FormFields>
  control: Control<FormFields>
  currencyCode: CurrencyCode
  onChangeValue?: (value: number) => void
  onBlur?: () => void
  returnKeyType?: ReturnKeyTypeOptions
  onSubmitEditing?: () => void
  style?: StyleProp<TextStyle>
  error?: FieldError
  multiline?: boolean
  editable?: boolean
  forwardRef?: React.Ref<any>
  disabled?: boolean
}

export const CurrencyInput = <FormFields extends FieldValues>({
  label,
  onChangeValue,
  onBlur,
  returnKeyType,
  onSubmitEditing,
  style,
  error,
  multiline,
  editable,
  control,
  name,
  forwardRef,
  disabled,
  currencyCode
}: Props<FormFields>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, onBlur: onControllerBlur, value } }) => {
        return (
          <>
            <PaperTextInput
              label={label}
              onBlur={() => {
                onControllerBlur()
                onBlur?.()
              }}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              style={style}
              error={error !== undefined}
              ref={forwardRef}
              multiline={multiline}
              editable={editable}
              render={(props) => (
                <NativeCurrencyInput
                  {...props}
                  value={value}
                  onChangeValue={(value) => {
                    onControllerChange(value)
                    onChangeValue?.(value as number)
                  }}
                  keyboardType="number-pad"
                  prefix={getCurrencySymbol(currencyCode)}
                  delimiter=","
                  separator="."
                  precision={2}
                />
              )}
              disabled={disabled}
            />
            <ErrorText visible={error !== undefined} message={error?.message} marginBottom={-5} marginTop={-5} />
          </>
        )
      }}
    />
  )
}

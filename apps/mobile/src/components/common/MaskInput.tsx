import React from 'react'
import { ReturnKeyTypeOptions, StyleProp, TextStyle } from 'react-native'
import NativeCurrencyInput from 'react-native-currency-input'
import { TextInput as PaperTextInput } from 'react-native-paper'

import { ErrorText } from './ErrorText'

type Props = {
  label: string
  amount: number
  onChangeValue?: (value: number) => void
  onBlur?: () => void
  returnKeyType?: ReturnKeyTypeOptions
  onSubmitEditing?: () => void
  style?: StyleProp<TextStyle>
  touched?: boolean | undefined
  errors?: string | undefined
  multiline?: boolean
  editable?: boolean
}

export const MaskInput = React.forwardRef<any, Props>(
  (
    {
      label,
      amount,
      onChangeValue,
      onBlur,
      returnKeyType,
      onSubmitEditing,
      style,
      touched,
      errors,
      multiline,
      editable
    },
    ref
  ) => {
    return (
      <>
        <PaperTextInput
          label={label}
          onBlur={onBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={style}
          error={touched && errors !== undefined}
          ref={ref}
          multiline={multiline}
          editable={editable}
          render={(props) => (
            <NativeCurrencyInput
              {...props}
              value={amount}
              onChangeValue={onChangeValue}
              keyboardType="number-pad"
              prefix="$"
              delimiter=","
              separator="."
              precision={2}
            />
          )}
        />
        <ErrorText visible={touched && errors !== undefined} message={errors} marginBottom={-5} marginTop={-5} />
      </>
    )
  }
)

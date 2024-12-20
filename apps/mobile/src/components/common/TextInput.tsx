import React, { ReactNode } from 'react'
import { Control, Controller, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { KeyboardTypeOptions, ReturnKeyTypeOptions, StyleProp, TextStyle } from 'react-native'
import MaskInput, { Mask } from 'react-native-mask-input'
import { TextInput as PaperTextInput } from 'react-native-paper'

import { TextContentType } from '../../types/text-content-type.type'
import { ErrorText } from './ErrorText'

type Props<FormFields extends FieldValues> = {
  label: string
  control: Control<FormFields>
  name: FieldPath<FormFields>
  onChangeText?: (text: string) => void
  onBlur?: () => void
  onFocus?: () => void
  returnKeyType?: ReturnKeyTypeOptions
  onSubmitEditing?: () => void
  style?: StyleProp<TextStyle>
  error?: FieldError
  multiline?: boolean
  editable?: boolean
  right?: ReactNode
  keyboardType?: KeyboardTypeOptions
  forwardRef?: React.Ref<any>
  format?: (value: any) => string
  disabled?: boolean
  secureTextEntry?: boolean
  textContentType?: TextContentType
  mask?: Mask
}

export const TextInput = <FormFields extends FieldValues>({
  label,
  onChangeText,
  onBlur,
  onFocus,
  returnKeyType,
  onSubmitEditing,
  style,
  error,
  multiline,
  editable,
  right,
  keyboardType,
  control,
  name,
  forwardRef,
  format,
  disabled,
  secureTextEntry,
  textContentType,
  mask
}: Props<FormFields>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, onBlur: onControllerBlur, value } }) => (
        <>
          <PaperTextInput
            label={label}
            value={format ? format(value) : value?.toString()}
            onChangeText={(value) => {
              onControllerChange(value)
              onChangeText?.(value)
            }}
            onBlur={() => {
              onControllerBlur()
              onBlur?.()
            }}
            onFocus={onFocus}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            style={style}
            error={error != null}
            ref={forwardRef}
            multiline={multiline}
            editable={editable}
            right={right}
            keyboardType={keyboardType}
            disabled={disabled}
            secureTextEntry={secureTextEntry}
            textContentType={textContentType}
            render={
              mask
                ? (props) => (
                    <MaskInput
                      {...props}
                      onChangeText={(_masked, unmasked) => {
                        onControllerChange(unmasked)
                        onChangeText?.(unmasked)
                      }}
                      mask={mask}
                    />
                  )
                : undefined
            }
          />
          <ErrorText visible={error != null} message={error?.message} marginBottom={0} marginTop={-5} />
        </>
      )}
    />
  )
}

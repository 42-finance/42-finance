import { Control, Controller, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { StyleProp, ViewStyle } from 'react-native'

import { ErrorText } from './ErrorText'
import { PaperPickerSelect } from './PaperPickerSelect'

type Props<T, FormFields extends FieldValues> = {
  label: string
  control: Control<FormFields>
  name: FieldPath<FormFields>
  onValueChange?: (value: T) => void
  items: { label: string; value: T }[]
  backgroundColor?: string
  style?: StyleProp<ViewStyle>
  error?: FieldError
}

export const PaperPickerField = <T extends unknown, FormFields extends FieldValues>({
  label,
  onValueChange,
  items,
  style,
  error,
  control,
  name
}: Props<T, FormFields>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: onControllerChange, value } }) => (
        <>
          <PaperPickerSelect
            onValueChange={(value) => {
              onControllerChange(value)
              onValueChange?.(value)
            }}
            items={items}
            label={label}
            style={{
              inputAndroidContainer: {
                ...(style as object)
              },
              inputIOSContainer: {
                ...(style as object)
              }
            }}
            value={value}
            error={error != null}
          />
          <ErrorText visible={error != null} message={error?.message} marginBottom={-5} marginTop={-5} />
        </>
      )}
    />
  )
}

import { format } from 'date-fns'
import { useState } from 'react'
import { Control, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { StyleProp, ViewStyle } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { TouchableTextInput } from './TouchableTextInput'

type Props<FormFields extends FieldValues> = {
  label: string
  name: FieldPath<FormFields>
  control: Control<FormFields>
  value: Date | undefined
  setValue: (value: Date) => void
  error?: FieldError
  style?: StyleProp<ViewStyle>
  clearable?: boolean
  onClear?: () => void
}

export const DateField = <FormFields extends FieldValues>({
  label,
  name,
  control,
  value,
  setValue,
  error,
  style,
  clearable,
  onClear
}: Props<FormFields>) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <>
      <TouchableTextInput
        label={label}
        name={name}
        control={control}
        error={error}
        onPress={() => setShowDatePicker(true)}
        format={(value) => (value ? format(value, 'MMMM d, yyyy') : '')}
        style={style}
        clearable={clearable}
        onClear={onClear}
      />
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={value}
        mode="date"
        display="inline"
        onConfirm={(date) => {
          setShowDatePicker(false)
          setValue(date)
        }}
        onCancel={() => {
          setShowDatePicker(false)
        }}
      />
    </>
  )
}

import { Entypo } from '@expo/vector-icons'
import { Control, FieldError, FieldPath, FieldValues } from 'react-hook-form'
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

import { TextInput } from './TextInput'
import { View } from './View'

type Props<FormFields extends FieldValues> = {
  label: string
  control: Control<FormFields>
  name: FieldPath<FormFields>
  error?: FieldError
  onPress: () => void
  style?: StyleProp<ViewStyle>
  format?: (value: any) => string
  clearable?: boolean
  onClear?: () => void
}

export const TouchableTextInput = <FormFields extends FieldValues>({
  label,
  control,
  name,
  error,
  onPress,
  style,
  format,
  clearable,
  onClear
}: Props<FormFields>) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} style={[style, { position: 'relative' }]}>
      <View pointerEvents="box-only">
        <TextInput label={label} name={name} control={control} error={error} editable={false} format={format} />
      </View>
      {clearable && onClear && (
        <TouchableOpacity style={{ position: 'absolute', right: 8, top: 15 }} onPress={onClear}>
          <Entypo name="cross" size={30} color={colors.onSurface} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

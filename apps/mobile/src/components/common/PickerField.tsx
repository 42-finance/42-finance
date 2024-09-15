import { Platform } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

import { PickerSelect } from './PickerSelect'
import { View } from './View'

type Props<T> = {
  label: string
  onValueChange: (value: T) => void
  items: { label: string; value: T }[]
  value: T
  showPlaceholder?: boolean
  placeholder?: string
  backgroundColor?: string
}

export const PickerField = <T extends unknown>({
  label,
  onValueChange,
  items,
  value,
  showPlaceholder,
  placeholder = 'Select...',
  backgroundColor
}: Props<T>) => {
  const { colors } = useTheme()

  return (
    <View
      style={{
        backgroundColor: backgroundColor ?? colors.elevation.level2,
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <View pointerEvents="none" style={{ position: 'absolute', left: 0 }}>
        <Text
          variant="bodyMedium"
          style={{
            color: colors.onSurface,
            marginTop: Platform.OS === 'ios' ? 25 : 30,
            marginStart: 20
          }}
        >
          {label}
        </Text>
      </View>
      <PickerSelect
        onValueChange={onValueChange}
        items={items}
        style={{
          inputIOS: {
            color: colors.onSurface,
            paddingVertical: 25,
            paddingHorizontal: 20,
            textAlign: 'right'
          },
          inputAndroid: {
            color: colors.onSurface,
            paddingVertical: 25,
            paddingHorizontal: 20,
            textAlign: 'right',
            width: '100%'
          },
          inputAndroidContainer: {
            flexDirection: 'row'
          }
        }}
        value={value}
        placeholder={showPlaceholder ? { label: placeholder, value: null } : null}
      />
    </View>
  )
}

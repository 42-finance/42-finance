import { MaterialIcons } from '@expo/vector-icons'
import { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

type Props = {
  label: string
  icon: ReactNode
  onPress: () => void
}
export const SettingsItem: React.FC<Props> = ({ label, icon, onPress }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: colors.elevation.level2,
        alignItems: 'center'
      }}
    >
      {icon}
      <Text variant="titleMedium" style={{ marginStart: 15, flex: 1 }}>
        {label}
      </Text>
      <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
    </TouchableOpacity>
  )
}

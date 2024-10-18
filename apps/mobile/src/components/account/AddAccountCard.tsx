import { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

type Props = {
  text: string
  icon: ReactNode
  onPress: () => void
  disabled?: boolean
}

export const AddAccountCard: React.FC<Props> = ({ text, icon, onPress, disabled }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: colors.elevation.level2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 125,
        borderRadius: 10,
        marginHorizontal: 2.5,
        opacity: disabled ? 0.5 : 1
      }}
      disabled={disabled}
    >
      {icon}
      <Text variant="bodyMedium" style={{ color: colors.onSurface, marginTop: 15 }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

import { Switch, Text, useTheme } from 'react-native-paper'
import { View } from '../common/View'

type Props = {
  label: string
  value: boolean
  onValueChanged: (value: boolean) => void
}

export const NotificationSettingsItem: React.FC<Props> = ({ label, value, onValueChanged }) => {
  const { colors } = useTheme()

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: colors.elevation.level2,
        alignItems: 'center'
      }}
    >
      <Text variant="titleMedium" style={{ flex: 1 }}>
        {label}
      </Text>
      <Switch value={value} onValueChange={onValueChanged} />
    </View>
  )
}

import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { View } from './View'

type Props = {
  onPress: () => void
  label: string
  values: string[]
}

export const FilterLink: React.FC<Props> = ({ onPress, label, values }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          backgroundColor: colors.elevation.level2
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium">{label}</Text>
          {values.map((v, index) => (
            <Text key={index} variant="bodyMedium" style={{ marginTop: 10 }}>
              {v}
            </Text>
          ))}
        </View>
        <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
      </View>
    </TouchableOpacity>
  )
}

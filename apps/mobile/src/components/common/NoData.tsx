import { FontAwesome6 } from '@expo/vector-icons'
import { Avatar, Text, useTheme } from 'react-native-paper'

import { View } from './View'

type Props = {
  text: string
}

export const NoData: React.FC<Props> = ({ text }) => {
  const { colors } = useTheme()

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <Avatar.Icon
        size={60}
        icon={() => <FontAwesome6 name="dollar" size={32} color={colors.onSurface} />}
        style={{
          backgroundColor: colors.background
        }}
      />
      <Text variant="titleMedium" style={{ marginTop: 10 }}>
        {text}
      </Text>
    </View>
  )
}

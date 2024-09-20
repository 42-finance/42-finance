import { FontAwesome6 } from '@expo/vector-icons'
import { Avatar, Text, useTheme } from 'react-native-paper'

import { View } from './View'

type Props = {
  text: string
}

export const NoData: React.FC<Props> = ({ text }) => {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', padding: 20 }}>
      <Avatar.Icon
        size={60}
        icon={() => <FontAwesome6 name="dollar" size={32} color={colors.onSurface} />}
        style={{
          marginEnd: 15,
          backgroundColor: colors.background,
          alignSelf: 'center'
        }}
      />
      <Text variant="titleMedium" style={{ marginTop: 10 }}>
        {text}
      </Text>
    </View>
  )
}

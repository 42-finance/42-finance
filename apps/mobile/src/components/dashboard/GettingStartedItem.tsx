import { FontAwesome5 } from '@expo/vector-icons'
import { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar, Text, useTheme } from 'react-native-paper'

type Props = {
  title: string
  icon: ReactNode
  complete: boolean
  onPress: () => void
}

export const GettingStartedItem: React.FC<Props> = ({ title, icon, complete, onPress }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }} onPress={onPress}>
      <Avatar.Icon
        size={36}
        icon={() => icon}
        style={{
          marginEnd: 10,
          backgroundColor: colors.background,
          alignSelf: 'center'
        }}
      />
      <Text variant="titleMedium" style={{ color: colors.outline, flex: 1 }}>
        {title}
      </Text>
      {complete ? (
        <Avatar.Icon
          size={24}
          icon={() => <FontAwesome5 name="check" size={12} color="white" />}
          style={{ backgroundColor: colors.primary }}
        />
      ) : (
        <Avatar.Icon size={24} icon={() => null} style={{ backgroundColor: colors.outline }} />
      )}
    </TouchableOpacity>
  )
}

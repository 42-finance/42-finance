import { MaterialIcons } from '@expo/vector-icons'
import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

type Props = {
  title: string
  iconSource: ImageSourcePropType
  onPress: () => void
  tintColor?: string
}

export const CommunityItem: React.FC<Props> = ({ title, iconSource, onPress, tintColor }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }} onPress={onPress}>
      <Image
        resizeMode="cover"
        style={{
          width: 30,
          height: 30,
          backgroundColor: 'transparent',
          alignSelf: 'center',
          tintColor
        }}
        source={iconSource}
      />
      <Text variant="titleMedium" style={{ color: colors.outline, flex: 1, marginLeft: 15 }}>
        {title}
      </Text>
      <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
    </TouchableOpacity>
  )
}

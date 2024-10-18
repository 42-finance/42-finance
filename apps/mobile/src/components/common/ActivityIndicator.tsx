import { ActivityIndicator as NativeIndicator, Platform, StyleProp, ViewStyle } from 'react-native'
import { ActivityIndicator as PaperIndicator, useTheme } from 'react-native-paper'

type Props = {
  color?: string
  style?: StyleProp<ViewStyle>
}

export const ActivityIndicator: React.FC<Props> = ({ color, style }) => {
  const { colors } = useTheme()

  if (Platform.OS === 'android') {
    return <NativeIndicator color={color ?? colors.primary} style={style} />
  }
  return <PaperIndicator color={color ?? colors.primary} style={style} />
}

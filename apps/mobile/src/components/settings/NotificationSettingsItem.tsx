import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NotificationSetting } from 'frontend-types'
import { mapNotificationSettingType, mapNotificationSettingValue } from 'frontend-utils'
import { TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { NotificationType } from 'shared-types'

import { View } from '../common/View'

type Props = {
  type: NotificationType
  value: NotificationSetting | null
}

export const NotificationSettingsItem: React.FC<Props> = ({ type, value }) => {
  const { colors } = useTheme()
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('NotificationSetting', {
          type,
          sendPushNotification: value?.sendPushNotification ?? false,
          sendEmail: value?.sendEmail ?? false,
          minimumAmount: value?.minimumAmount ?? null
        })
      }
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: colors.elevation.level2,
        alignItems: 'center'
      }}
    >
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium">{mapNotificationSettingType(type)}</Text>
        <Text variant="bodyMedium" style={{ marginTop: 5 }}>
          {mapNotificationSettingValue(value?.sendPushNotification, value?.sendEmail)}
        </Text>
      </View>
      <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
    </TouchableOpacity>
  )
}

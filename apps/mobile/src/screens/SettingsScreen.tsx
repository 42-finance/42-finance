import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons
} from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { deleteNotificationToken } from 'frontend-api'
import * as React from 'react'
import { ScrollView } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import Purchases from 'react-native-purchases'

import { SettingsItem } from '../components/settings/SettingsItems'
import { useUserTokenContext } from '../contexts/user-token.context'
import { RootStackScreenProps } from '../types/root-stack-screen-props'
import { getPushToken } from '../utils/notification.utils'

export const SettingsScreen: React.FC<RootStackScreenProps<'Settings'>> = ({ navigation }) => {
  const { setToken } = useUserTokenContext()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const logout = async () => {
    getPushToken()
      .then((token) => {
        if (token) {
          deleteNotificationToken(token.data)
        }
      })
      .catch((error: any) => {
        console.log(error.message)
      })
      .finally(() => {
        setToken(null)
        SecureStore.deleteItemAsync('token')
        queryClient.removeQueries()
        Purchases.logOut()
      })
    navigation.replace('Login')
  }

  return (
    <ScrollView>
      <Text variant="bodySmall" style={{ color: colors.outline, padding: 20 }}>
        ACCOUNT
      </Text>
      <Divider />
      <SettingsItem
        label="Profile"
        icon={<FontAwesome name="user" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Profile')}
      />
      <Divider />
      <SettingsItem
        label="Change Password"
        icon={<Ionicons name="key" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('ChangePassword')}
      />
      <Divider />
      <SettingsItem
        label="Notifications"
        icon={<Ionicons name="notifications" size={20} color={colors.onSurface} style={{ marginStart: -2 }} />}
        onPress={() => navigation.navigate('NotificationSettings')}
      />
      <Divider />
      <SettingsItem
        label="Subscription"
        icon={<FontAwesome name="credit-card" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Subscription')}
      />
      <Divider />
      <SettingsItem
        label="Data"
        icon={<FontAwesome5 name="database" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Data')}
      />
      <Divider />
      <SettingsItem
        label="Sign Out"
        icon={<FontAwesome5 name="sign-out-alt" size={20} color={colors.onSurface} />}
        onPress={logout}
      />
      <Divider />
      <Text variant="bodySmall" style={{ color: colors.outline, padding: 20 }}>
        HOUSEHOLD
      </Text>
      <SettingsItem
        label="Categories"
        icon={<AntDesign name="appstore-o" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Categories')}
      />
      <Divider />
      <SettingsItem
        label="Connections"
        icon={<Feather name="link" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Connections')}
      />
      <Divider />
      <SettingsItem
        label="Goals"
        icon={<Feather name="target" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Goals')}
      />
      <Divider />
      <SettingsItem
        label="Members"
        icon={<AntDesign name="user" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Members')}
      />
      <Divider />
      <SettingsItem
        label="Merchants"
        icon={<FontAwesome6 name="building" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Merchants')}
      />
      <Divider />
      <SettingsItem
        label="Rules"
        icon={<MaterialIcons name="rule" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Rules')}
      />
      <Divider />
      <SettingsItem
        label="Tags"
        icon={<AntDesign name="tagso" size={20} color={colors.onSurface} />}
        onPress={() => navigation.navigate('Tags')}
      />
      <Divider />
    </ScrollView>
  )
}

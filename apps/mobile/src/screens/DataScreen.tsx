import { AntDesign } from '@expo/vector-icons'
import { useMutation } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import { deleteUser } from 'frontend-api'
import { setMessage } from 'frontend-utils'
import { useUserTokenContext } from 'frontend-utils/src/contexts/user-token.context'
import * as React from 'react'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { SettingsItem } from '../components/settings/SettingsItems'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const DataScreen: React.FC<RootStackScreenProps<'Data'>> = ({ navigation }) => {
  const { setToken } = useUserTokenContext()
  const { colors } = useTheme()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const logout = async () => {
    setToken(null)
    await SecureStore.deleteItemAsync('token')
    navigation.replace('Login')
  }

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async () => {
      const res = await deleteUser()
      if (res.ok) {
        setMessage('Your account and all data has been deleted.')
        logout()
      }
    }
  })

  return (
    <ScrollView>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete your account? Account data cannot be recovered.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={{ padding: 20 }}>
        <Text variant="bodySmall" style={{ color: colors.outline }}>
          ACCOUNT
        </Text>
      </View>
      <SettingsItem
        label="Delete account"
        icon={<AntDesign name="deleteuser" size={20} color={colors.onSurface} />}
        onPress={() => setDeleteDialogVisible(true)}
      />
    </ScrollView>
  )
}

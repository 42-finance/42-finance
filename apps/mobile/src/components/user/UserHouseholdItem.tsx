import { AntDesign, Entypo } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, DeleteUserInviteRequest, deleteHouseholdUser, deleteUserInvite } from 'frontend-api'
import { getInitials } from 'frontend-utils'
import { mapUserPermission } from 'frontend-utils/src/mappers/map-user-permission'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar, Button, Dialog, Divider, Portal, Text, useTheme } from 'react-native-paper'

import { HouseholdUser } from '../../../../../libs/frontend-types/src/household-user.type'
import { ActivityIndicator } from '../common/ActivityIndicator'
import { View } from '../common/View'

type Props = {
  householdUser: HouseholdUser
}

export const HouseholdUserItem: React.FC<Props> = ({ householdUser }) => {
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [deleteUserInviteDialogVisible, setDeleteUserInviteDialogVisible] = useState(false)
  const [deleteHouseholdUserDialogVisible, setDeleteHouseholdUserDialogVisible] = useState(false)

  const { mutate: deleteUserInviteMutation, isPending: submittingDeleteUserInvite } = useMutation({
    mutationFn: async (request: DeleteUserInviteRequest) => {
      const res = await deleteUserInvite(request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.HouseholdUsers] })
      }
    }
  })

  const { mutate: deleteHouseholdUserMutation, isPending: submittingDeleteHouseholdUser } = useMutation({
    mutationFn: async (userId: number) => {
      const res = await deleteHouseholdUser(userId)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.HouseholdUsers] })
      }
    }
  })

  return (
    <>
      <Portal>
        <Dialog visible={deleteUserInviteDialogVisible} onDismiss={() => setDeleteUserInviteDialogVisible(false)}>
          <Dialog.Title>Delete Invitation</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this invitation?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteUserInviteDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setDeleteUserInviteDialogVisible(false)
                deleteUserInviteMutation({ email: householdUser.email })
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={deleteHouseholdUserDialogVisible} onDismiss={() => setDeleteHouseholdUserDialogVisible(false)}>
          <Dialog.Title>Remove User</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to remove this user from this household?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteHouseholdUserDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setDeleteHouseholdUserDialogVisible(false)
                deleteHouseholdUserMutation(householdUser.userId)
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {householdUser.user ? (
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: colors.elevation.level2,
            alignItems: 'center'
          }}
        >
          <Avatar.Text
            size={48}
            label={getInitials(householdUser.user.name)}
            style={{ marginEnd: 15 }}
            color={colors.onPrimary}
            labelStyle={{ marginTop: -3 }}
          />
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium">{householdUser.user.name}</Text>
            <Text variant="bodyMedium">{mapUserPermission(householdUser.permission)}</Text>
          </View>
          {submittingDeleteHouseholdUser ? (
            <ActivityIndicator />
          ) : householdUser.canDelete ? (
            <TouchableOpacity onPress={() => setDeleteHouseholdUserDialogVisible(true)}>
              <Entypo name="cross" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: colors.elevation.level2,
            alignItems: 'center'
          }}
        >
          <Avatar.Icon
            size={48}
            icon={() => <AntDesign name="user" size={24} color={colors.onPrimary} />}
            style={{ marginEnd: 15, alignSelf: 'center' }}
          />
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium">{householdUser.email}</Text>
            <Text variant="bodyMedium">{mapUserPermission(householdUser.permission)} - Pending</Text>
          </View>
          {submittingDeleteUserInvite ? (
            <ActivityIndicator />
          ) : householdUser.canDelete ? (
            <TouchableOpacity onPress={() => setDeleteUserInviteDialogVisible(true)}>
              <Entypo name="cross" size={24} color={colors.onSurface} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
      <Divider />
    </>
  )
}

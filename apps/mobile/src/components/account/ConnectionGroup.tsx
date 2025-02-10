import { FontAwesome6, Ionicons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, DeleteConnectionRequest, deleteConnection } from 'frontend-api'
import { mapAccountSubType } from 'frontend-utils'
import { formatAccountName } from 'frontend-utils/src/account/account.utils'
import { formatDateDifference } from 'frontend-utils/src/date/date.utils'
import { mapConnectionType } from 'frontend-utils/src/mappers/map-connection-type'
import { useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Avatar, Button, Card, Dialog, Divider, Portal, Text, useTheme } from 'react-native-paper'
import { ConnectionType } from 'shared-types'

import { Connection } from '../../../../../libs/frontend-types/src/connection.type'
import { useActionSheet } from '../../hooks/use-action-sheet.hook'
import { ActivityIndicator } from '../common/ActivityIndicator'
import { View } from '../common/View'

type Props = {
  connection: Connection
}

export const ConnectionGroup: React.FC<Props> = ({ connection }) => {
  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async (request: DeleteConnectionRequest) => {
      const res = await deleteConnection(connection.id, request)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Connections] })
      }
    }
  })

  const lastUpdated = useMemo(
    () =>
      connection.accounts.reduce(
        (acc, value) => {
          if (acc == null || value.updatedAt.getTime() > acc.getTime()) {
            return value.updatedAt
          }
          return acc
        },
        null as Date | null
      ),
    [connection]
  )

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
        <View>
          <Portal>
            <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
              <Dialog.Title>Delete Connection</Dialog.Title>
              <Dialog.Content>
                <Text>
                  Are you sure you want to delete this connection? You can choose to keep your existing accounts and
                  transaction data or completely remove all data.
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
                <Button
                  onPress={() => {
                    setDeleteDialogVisible(false)
                    deleteMutation({ keepData: false })
                  }}
                >
                  Delete Data
                </Button>
                <Button
                  onPress={() => {
                    setDeleteDialogVisible(false)
                    deleteMutation({ keepData: true })
                  }}
                >
                  Keep Data
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingBottom: 15
            }}
          >
            {connection.institutionLogo == null ? (
              <Avatar.Icon
                size={36}
                icon={() => <FontAwesome6 name="building" size={20} color={colors.outline} />}
                style={{ marginEnd: 15, backgroundColor: colors.surface }}
              />
            ) : connection.type === ConnectionType.Plaid ? (
              <Avatar.Image
                size={36}
                source={{ uri: `data:image/png;base64,${connection.institutionLogo}` }}
                style={{ marginEnd: 15 }}
              />
            ) : (
              <Avatar.Image size={36} source={{ uri: connection.institutionLogo }} style={{ marginEnd: 15 }} />
            )}
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                flex: 1
              }}
            >
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {connection.institutionName}
              </Text>
              <Text variant="bodySmall" style={{ fontWeight: '500', color: colors.outline }}>
                {mapConnectionType(connection.type)} · Last update {formatDateDifference(lastUpdated ?? new Date())}
              </Text>
            </View>
            {loadingDelete ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  showActionSheet([
                    {
                      label: 'Delete connection',
                      onSelected: () => setDeleteDialogVisible(true),
                      isDestructive: true
                    }
                  ])
                }}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.onSurface} />
              </TouchableOpacity>
            )}
          </View>
          {connection.accounts.map((account) => (
            <View key={account.id}>
              <Divider />
              <View
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  paddingHorizontal: 15,
                  paddingVertical: 15
                }}
              >
                <Text variant="titleMedium">{formatAccountName(account)}</Text>
                <Text variant="bodySmall" style={{ marginTop: 5 }}>
                  {mapAccountSubType(account.subType)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  )
}

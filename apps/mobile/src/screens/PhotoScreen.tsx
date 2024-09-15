import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteAttachment } from 'frontend-api'
import React, { useEffect } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const PhotoScreen: React.FC<RootStackScreenProps<'Photo'>> = ({ route, navigation }) => {
  const { transactionId, attachment } = route.params

  const showActionSheet = useActionSheet()
  const queryClient = useQueryClient()
  const { colors } = useTheme()

  const { mutate: mutateDeleteAttachment, isPending: pendingDeleteAttachment } = useMutation({
    mutationFn: async () => {
      const res = await deleteAttachment(transactionId, attachment)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Transaction] })
        navigation.pop()
      }
    }
  })

  const formatAttachment = (attachment: string) => {
    const parts = attachment.split('_')
    return parts[parts.length - 1]
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Delete attachment',
                onSelected: () => mutateDeleteAttachment(),
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      title: formatAttachment(attachment)
    })
  }, [attachment, colors.onSurface, mutateDeleteAttachment, navigation, showActionSheet])

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Image style={{ flex: 1, objectFit: 'contain' }} source={{ uri: attachment }} />
      {pendingDeleteAttachment && (
        <ActivityIndicator style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
      )}
    </View>
  )
}

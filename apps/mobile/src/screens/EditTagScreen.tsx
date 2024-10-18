import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditTagRequest, deleteTag, editTag, getTag } from 'frontend-api'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { Button, Dialog, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'

import { TagForm, TagFormFields } from '../components/forms/TagForm'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditTagScreen = ({ route, navigation }: RootStackScreenProps<'EditTag'>) => {
  const { tagId } = route.params

  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const showActionSheet = useActionSheet()

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { data: tag } = useQuery({
    queryKey: [ApiQuery.Tag, tagId],
    queryFn: async () => {
      const res = await getTag(tagId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditTagRequest) => {
      Keyboard.dismiss()
      const res = await editTag(tagId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Tags] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Tag] })
        navigation.pop()
      }
    }
  })

  const { mutate: deleteMutation, isPending: submittingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteTag(tagId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Tags] })
        navigation.pop()
      }
    }
  })

  const onSubmit = (values: TagFormFields) => {
    mutate({
      color: values.color,
      name: values.name
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Delete tag',
                onSelected: () => {
                  setDeleteDialogVisible(true)
                },
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation, showActionSheet])

  if (!tag || submittingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <>
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Tag</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this tag?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <TagForm tagInfo={tag} onSubmit={onSubmit} submitting={submitting} />
    </>
  )
}

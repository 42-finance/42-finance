import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, EditGroupRequest, editGroup, getGroup } from 'frontend-api'
import * as React from 'react'
import { useEffect } from 'react'
import { Keyboard, ScrollView, TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'

import { GroupForm } from '../components/forms/GroupForm'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const EditGroupScreen = ({ route, navigation }: RootStackScreenProps<'EditGroup'>) => {
  const { groupId } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const { data: group } = useQuery({
    queryKey: [ApiQuery.Group, groupId],
    queryFn: async () => {
      const res = await getGroup(groupId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    }
  })

  const { mutate, isPending: submitting } = useMutation({
    mutationFn: async (request: EditGroupRequest) => {
      Keyboard.dismiss()
      const res = await editGroup(groupId, request)
      if (res.ok && res.parsedBody?.payload) {
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        await queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
        navigation.pop()
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        group ? (
          <TouchableOpacity
            onPress={() => {
              showActionSheet([
                {
                  label: 'Delete group',
                  onSelected: () =>
                    navigation.navigate('ReassignGroup', {
                      groupId: group.id,
                      groupName: group.name,
                      categoryCount: group.categories?.length ?? 0
                    })
                }
              ])
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        ) : null
    })
  }, [colors, group, navigation, showActionSheet])

  if (!group) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <ScrollView>
      <GroupForm groupInfo={group} onSubmit={mutate} submitting={submitting} />
    </ScrollView>
  )
}

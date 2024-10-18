import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQuery, deleteGroup, getGroups } from 'frontend-api'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Divider, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'

import { Group } from '../../../../libs/frontend-types/src/group.type'
import { ActivityIndicator } from '../components/common/ActivityIndicator'
import { View } from '../components/common/View'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const ReassignGroupScreen = ({ navigation, route }: RootStackScreenProps<'ReassignGroup'>) => {
  const { groupId, groupName, categoryCount } = route.params

  const { colors } = useTheme()
  const queryClient = useQueryClient()

  const { data: groups = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Groups],
    queryFn: async () => {
      const res = await getGroups()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async (group: Group) => {
      const res = await deleteGroup(groupId, { newGroupId: group.id })
      if (res.ok && res.parsedBody?.payload) {
        navigation.navigate('Categories')
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Categories] })
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Groups] })
      }
    }
  })

  const mapCategoryCount = () => {
    if (categoryCount === 1) {
      return `is ${categoryCount} category`
    }

    return `are ${categoryCount} categories`
  }

  return (
    <ScrollView>
      <ProgressBar indeterminate visible={fetching} />

      <Text variant="bodyLarge" style={{ marginHorizontal: 15, marginVertical: 10 }}>
        There {mapCategoryCount()} nested in the group "{groupName}". Before you delete it, where should we move them
        to?
      </Text>

      <Divider />

      {groups
        .filter((g) => g.id !== groupId)
        .map((group) => (
          <TouchableOpacity key={group.id} onPress={() => deleteMutation(group)}>
            <Text variant="titleMedium" style={{ padding: 10, backgroundColor: colors.elevation.level2 }}>
              {group.name}
            </Text>
            <Divider />
          </TouchableOpacity>
        ))}

      {loadingDelete && (
        <Portal>
          <View style={{ flex: 1, zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        </Portal>
      )}
    </ScrollView>
  )
}

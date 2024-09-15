import { FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getHouseholdUsers } from 'frontend-api'
import { useEffect } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { HouseholdUserItem } from '../components/user/UserHouseholdItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const MembersScreen = ({ navigation }: RootStackScreenProps<'Members'>) => {
  const { colors } = useTheme()

  const { data: householdUsers = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.HouseholdUsers],
    queryFn: async () => {
      const res = await getHouseholdUsers()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('InviteUser')}>
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <FlatList data={householdUsers} renderItem={({ item }) => <HouseholdUserItem householdUser={item} />} />
    </View>
  )
}

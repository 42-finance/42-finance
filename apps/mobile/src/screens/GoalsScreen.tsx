import { FontAwesome5 } from '@expo/vector-icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGoals } from 'frontend-api'
import * as React from 'react'
import { useEffect } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { ProgressBar, useTheme } from 'react-native-paper'

import { View } from '../components/common/View'
import { GoalItem } from '../components/list-items/GoalItem'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const GoalsScreen = ({ navigation }: RootStackScreenProps<'Goals'>) => {
  const { colors } = useTheme()

  const { data: goals = [], isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Goals],
    queryFn: async () => {
      const res = await getGoals()
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
        <TouchableOpacity onPress={() => navigation.navigate('AddGoal')}>
          <FontAwesome5 name="plus" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <FlatList
        data={goals}
        renderItem={({ item, index }) => (
          <GoalItem
            key={item.id}
            goal={item}
            onSelected={() => {
              navigation.navigate('Goal', { goalId: item.id })
            }}
            index={index}
          />
        )}
      />
    </View>
  )
}

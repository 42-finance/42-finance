import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getGoals } from 'frontend-api'
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper'

import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus.hook'
import { View } from '../common/View'
import { GoalItem } from '../list-items/GoalItem'

export const GoalsWidget = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const { data: goals = [], refetch } = useQuery({
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

  useRefetchOnFocus(refetch)

  return (
    <Card mode="elevated" theme={{ roundness: 5 }} style={{ marginBottom: 15, marginHorizontal: 10 }}>
      <Card.Content style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Text variant="titleLarge" style={{ marginLeft: 15, marginTop: 5 }}>
          Goals
        </Text>
        <Divider style={{ marginTop: 15 }} />
        {goals.map((goal, index) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onSelected={(goal) => navigation.navigate('Goal', { goalId: goal.id })}
            index={index}
            backgroundColor="transparent"
          />
        ))}
        {goals.length === 0 && (
          <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', padding: 20 }}>
            <Feather name="target" size={48} color={colors.onSurface} />
            <Text variant="titleMedium" style={{ marginTop: 5 }}>
              No goals
            </Text>
          </View>
        )}
        <Divider />
        <Button
          mode="outlined"
          style={{ marginHorizontal: 15, marginTop: 10 }}
          onPress={() => navigation.navigate('Goals')}
        >
          View all goals
        </Button>
      </Card.Content>
    </Card>
  )
}

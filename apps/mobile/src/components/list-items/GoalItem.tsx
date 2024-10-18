import { Goal } from 'frontend-types'
import { calculateGoalProgress, formatDollars } from 'frontend-utils'
import { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { GoalType } from 'shared-types'

type Props = {
  goal: Goal
  onSelected: (goal: Goal) => void
  index?: number
  backgroundColor?: string
}

export const GoalItem = ({ goal, onSelected, index, backgroundColor }: Props) => {
  const { colors } = useTheme()

  const total = useMemo(
    () =>
      goal.accounts.reduce((acc, account) => {
        return acc + account.convertedBalance
      }, 0),
    [goal]
  )

  return (
    <TouchableOpacity
      onPress={() => {
        onSelected(goal)
      }}
      style={{
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: backgroundColor ?? colors.elevation.level2
      }}
    >
      <>
        {index != null && index > 0 && <Divider style={{ height: 1, backgroundColor: '#082043' }} />}
        <View style={{ flex: 1, padding: 20 }}>
          <Text variant="titleLarge">{goal.name}</Text>
          <ProgressBar
            progress={calculateGoalProgress(total, goal.amount, goal.type)}
            style={{
              borderRadius: 50,
              backgroundColor: colors.outline,
              marginVertical: 10,
              height: 8
            }}
            color="#19d2a5"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="titleMedium">{formatDollars(total)}</Text>
            <Text variant="titleMedium">
              {goal.type === GoalType.Savings ? formatDollars(goal.amount) : formatDollars(0)}
            </Text>
          </View>
        </View>
      </>
    </TouchableOpacity>
  )
}

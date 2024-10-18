import { Ionicons } from '@expo/vector-icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { endOfDay, startOfDay } from 'date-fns'
import { ApiQuery, deleteGoal, getGoal } from 'frontend-api'
import {
  calculateGoalBudgetAmount,
  calculateGoalTargetDate,
  dateToLocal,
  dateToUtc,
  formatAccountBalance,
  formatDateDifference,
  formatDateInUtc,
  formatDollars,
  mapAccountSubType,
  todayInUtc
} from 'frontend-utils'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Button, Dialog, Divider, Portal, ProgressBar, Text, useTheme } from 'react-native-paper'
import { GoalType } from 'shared-types'

import { AccountIcon } from '../components/account/AccountIcon'
import { View } from '../components/common/View'
import { GoalGraph } from '../components/stats/GoalGraph'
import { GoalSpendingGraph } from '../components/stats/GoalSpendingGraph'
import { useUserTokenContext } from '../contexts/user-token.context'
import { useActionSheet } from '../hooks/use-action-sheet.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const GoalScreen = ({ route, navigation }: RootStackScreenProps<'Goal'>) => {
  const { goalId } = route.params

  const showActionSheet = useActionSheet()
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const { currencyCode } = useUserTokenContext()

  const [today] = useState(todayInUtc())
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  const { data: goal, isFetching: fetching } = useQuery({
    queryKey: [ApiQuery.Goal, goalId],
    queryFn: async () => {
      const res = await getGoal(goalId)
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  const { mutate: deleteMutation, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const res = await deleteGoal(goalId)
      if (res.ok && res.parsedBody?.payload) {
        queryClient.invalidateQueries({ queryKey: [ApiQuery.Goals] })
        navigation.pop()
      }
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showActionSheet([
              {
                label: 'Edit goal',
                onSelected: () => navigation.navigate('EditGoal', { goalId })
              },
              {
                label: 'Delete goal',
                onSelected: () => setDeleteDialogVisible(true),
                isDestructive: true
              }
            ])
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      ),
      title: goal?.name
    })
  }, [colors.onSurface, goal?.name, goalId, navigation, showActionSheet])

  const startDate = useMemo(
    () => (goal ? dateToUtc(startOfDay(dateToLocal(goal.startDate ?? today))) : new Date()),
    [goal]
  )

  const endDate = useMemo(
    () => (goal ? dateToUtc(endOfDay(dateToLocal(goal.targetDate ?? today))) : new Date()),
    [goal]
  )

  const budgetAmount = useMemo(() => {
    if (goal == null) {
      return null
    }
    if (goal.budgetAmount != null) {
      return goal.budgetAmount
    }
    return calculateGoalBudgetAmount(goal.targetDate, goal.type, goal.accounts, goal.amount)
  }, [goal])

  const targetDate = useMemo(() => {
    if (goal == null) {
      return null
    }
    if (goal.targetDate) {
      return goal.targetDate
    }
    return calculateGoalTargetDate(goal.budgetAmount, goal.type, goal.accounts, goal.amount)
  }, [goal])

  if (!goal || loadingDelete) {
    return <ProgressBar indeterminate />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Goal</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this goal?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => deleteMutation()}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView>
        {goal.type === GoalType.Spending ? <GoalSpendingGraph goal={goal} /> : <GoalGraph goal={goal} />}
        {goal.type === GoalType.Spending ? (
          <>
            <View
              style={{
                backgroundColor: colors.elevation.level2,
                paddingHorizontal: 15,
                paddingVertical: 15,
                flexDirection: 'row'
              }}
            >
              <Text variant="titleMedium" style={{ flex: 1 }}>
                Start Date
              </Text>
              <Text variant="titleMedium">{formatDateInUtc(startDate, 'MMMM dd, yyyy')}</Text>
            </View>
            <Divider />
            <View
              style={{
                backgroundColor: colors.elevation.level2,
                paddingHorizontal: 15,
                paddingVertical: 15,
                flexDirection: 'row'
              }}
            >
              <Text variant="titleMedium" style={{ flex: 1 }}>
                End Date
              </Text>
              <Text variant="titleMedium">{formatDateInUtc(endDate, 'MMMM dd, yyyy')}</Text>
            </View>
            <Divider />
          </>
        ) : (
          <>
            {targetDate != null ? (
              <>
                <View
                  style={{
                    backgroundColor: colors.elevation.level2,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    flexDirection: 'row'
                  }}
                >
                  <Text variant="titleMedium" style={{ flex: 1 }}>
                    Target date
                  </Text>
                  <Text variant="titleMedium">{formatDateInUtc(targetDate, 'MMMM dd, yyyy')}</Text>
                </View>
                <Divider />
              </>
            ) : null}
            {budgetAmount != null ? (
              <>
                <View
                  style={{
                    backgroundColor: colors.elevation.level2,
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    flexDirection: 'row'
                  }}
                >
                  <Text variant="titleMedium" style={{ flex: 1 }}>
                    Monthly amount
                  </Text>
                  <Text variant="titleMedium">{formatDollars(budgetAmount, currencyCode)}</Text>
                </View>
                <Divider />
              </>
            ) : null}
          </>
        )}
        <View>
          <Text
            variant="titleMedium"
            style={{
              fontWeight: 'bold',
              padding: 15,
              backgroundColor: colors.elevation.level2
            }}
          >
            Accounts
          </Text>
        </View>
        <Divider />
        {goal.accounts.map((account) => (
          <TouchableOpacity key={account.id} onPress={() => navigation.navigate('Account', { accountId: account.id })}>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: 'transparent',
                paddingHorizontal: 15,
                paddingVertical: 15,
                alignItems: 'center'
              }}
            >
              <AccountIcon account={account} />
              <View
                style={{
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  flex: 1
                }}
              >
                <Text variant="titleMedium">{account.name}</Text>
                <Text variant="bodySmall" style={{ marginTop: 5 }}>
                  {mapAccountSubType(account.subType)}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'flex-end'
                }}
              >
                <Text variant="titleMedium">{formatAccountBalance(account, currencyCode)}</Text>
                <Text variant="bodySmall" style={{ marginTop: 5 }}>
                  {formatDateDifference(account.updatedAt)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

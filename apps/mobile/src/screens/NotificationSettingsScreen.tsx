import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getNotificationSettings } from 'frontend-api'
import { NotificationSetting } from 'frontend-types'
import * as React from 'react'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { Divider, ProgressBar, Text, useTheme } from 'react-native-paper'
import { NotificationType } from 'shared-types'

import { View } from '../components/common/View'
import { NotificationSettingsItem } from '../components/settings/NotificationSettingsItem'
import { useRefetchOnFocus } from '../hooks/use-refetch-on-focus.hook'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const NotificationSettingsScreen: React.FC<RootStackScreenProps<'NotificationSettings'>> = ({ navigation }) => {
  const { colors } = useTheme()

  const [settingValues, setSettingValues] = useState<Record<NotificationType, NotificationSetting>>(
    {} as Record<NotificationType, NotificationSetting>
  )

  const {
    data,
    isFetching: fetching,
    refetch
  } = useQuery({
    queryKey: [ApiQuery.NotificationSettings],
    queryFn: async () => {
      const res = await getNotificationSettings()
      if (res.ok && res.parsedBody?.payload) {
        const newValues = {} as Record<NotificationType, NotificationSetting>
        for (const notificationSetting of res.parsedBody.payload) {
          newValues[notificationSetting.type] = notificationSetting
        }
        setSettingValues(newValues)
        return res.parsedBody.payload
      }
      return []
    },
    placeholderData: keepPreviousData
  })

  useRefetchOnFocus(refetch)

  const groups = [
    {
      title: 'ACCOUNTS',
      settings: [
        NotificationType.AccountOutOfSync,
        NotificationType.BalanceSummary,
        NotificationType.MonthlyReview,
        NotificationType.YearlyReview
      ]
    },
    {
      title: 'BUDGET',
      settings: [NotificationType.BudgetExceeded]
    },
    {
      title: 'TRANSACTIONS',
      settings: [
        NotificationType.NewTransactionsSynced,
        NotificationType.NewRecurringTransaction,
        NotificationType.UpcomingRecurringTransaction,
        NotificationType.NewExpense,
        NotificationType.NewDeposit
      ]
    },
    {
      title: 'GOALS',
      settings: [NotificationType.GoalMilestone, NotificationType.MonthlyGoalUpdate]
    },
    {
      title: 'SUPPORT',
      settings: [NotificationType.ProductUpdates]
    }
  ]

  if (!data) {
    return <ProgressBar indeterminate visible />
  }

  return (
    <View style={{ flex: 1 }}>
      <ProgressBar indeterminate visible={fetching} />
      <ScrollView>
        {groups.map((group) => (
          <View key={group.title}>
            <View style={{ padding: 20 }}>
              <Text variant="bodySmall" style={{ color: colors.outline }}>
                {group.title}
              </Text>
            </View>
            <Divider />
            {group.settings.map((setting) => (
              <View key={setting}>
                <NotificationSettingsItem type={setting} value={settingValues[setting] ?? null} />
                <Divider />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

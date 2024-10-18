import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ApiQuery, getNotificationSettings } from 'frontend-api'
import { NotificationSetting } from 'frontend-types'
import { useState } from 'react'
import { NotificationType } from 'shared-types'

import { Alert } from '../common/alert/alert'
import { Card } from '../common/card/card'
import { NotificationSettingItem } from './notification-setting-item'

export const NotificationSettings = () => {
  const [settingValues, setSettingValues] = useState<Record<NotificationType, NotificationSetting>>(
    {} as Record<NotificationType, NotificationSetting>
  )

  const { data } = useQuery({
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
    return null
  }

  return (
    <Card title="Notifications" className="mt-4">
      <Alert
        message="Control the notifications you receive by toggling the options below."
        className="mb-5 inline-block m-4"
        showIcon
      />
      {groups.map((group) => (
        <div key={group.title}>
          <div className="font-semibold text-base border-y p-4">{group.title}</div>
          {group.settings.map((setting) => (
            <NotificationSettingItem key={setting} type={setting} value={settingValues[setting]} />
          ))}
        </div>
      ))}
    </Card>
  )
}

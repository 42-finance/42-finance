import { NotificationType } from 'shared-types'

export const mapNotificationSettingType = (notificationType: NotificationType) => {
  switch (notificationType) {
    case NotificationType.AccountOutOfSync:
      return 'Account out of sync'
    case NotificationType.BalanceSummary:
      return 'Balance summary'
    case NotificationType.BudgetExceeded:
      return 'Budget exceeded'
    case NotificationType.NewTransactionsSynced:
      return 'New transactions synced'
    case NotificationType.NewRecurringTransaction:
      return 'New recurring transaction'
    case NotificationType.UpcomingRecurringTransaction:
      return 'Recurring transaction reminder'
    case NotificationType.NewExpense:
      return 'Expense alert'
    case NotificationType.NewDeposit:
      return 'Deposit alert'
    case NotificationType.GoalMilestone:
      return 'Goal milestone'
    case NotificationType.MonthlyGoalUpdate:
      return 'Monthly goal summary'
    case NotificationType.MonthlyReview:
      return 'Monthly review'
    case NotificationType.YearlyReview:
      return 'Yearly review'
    case NotificationType.ProductUpdates:
      return 'Product updates'
  }
}

export const mapNotificationSettingDescription = (notificationType: NotificationType) => {
  switch (notificationType) {
    case NotificationType.AccountOutOfSync:
      return `You'll receive a notification when an account stops syncing and it's credentials need to be updated.`
    case NotificationType.BalanceSummary:
      return `You'll receive a notification with a summary of your account balances when they are updated.`
    case NotificationType.BudgetExceeded:
      return `You'll receive a notification when you exceed your budget in a category or group.`
    case NotificationType.NewTransactionsSynced:
      return `You'll receive a notification when new transactions are synced.`
    case NotificationType.NewRecurringTransaction:
      return `You'll receive a notification when a new recurring transactions has been detected.`
    case NotificationType.UpcomingRecurringTransaction:
      return `You'll receive a notification 3 days before a recurring transaction is expected.`
    case NotificationType.NewExpense:
      return `You'll receive a notification when a new expense above the specified amount is synced.`
    case NotificationType.NewDeposit:
      return `You'll receive a notification when a new deposit above the specified amount is synced.`
    case NotificationType.GoalMilestone:
      return `You'll receive a notification when you reach a milestone of your goal balance.`
    case NotificationType.MonthlyGoalUpdate:
      return `You'll receive a notification at the end of the month with a summary of you goals progress.`
    case NotificationType.MonthlyReview:
      return `You'll receive a notification at the end of the month with a summary of the months spending and balances.`
    case NotificationType.YearlyReview:
      return `You'll receive a notification at the end of the year with a summary of the years spending and balances.`
    case NotificationType.ProductUpdates:
      return `You'll receive a notification when new updates and features are released.`
  }
}

export const mapNotificationSettingValue = (sendPushNotification?: boolean, sendEmail?: boolean) => {
  if (sendPushNotification && sendEmail) {
    return 'Email and Push Notification'
  }
  if (sendPushNotification) {
    return 'Push Notification Only'
  }
  if (sendEmail) {
    return 'Email Only'
  }
  return 'Disabled'
}

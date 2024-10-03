import { DashboardWidgetType } from 'shared-types'

export const mapDashboardWidgetType = (dashboardWidgetType: DashboardWidgetType) => {
  switch (dashboardWidgetType) {
    case DashboardWidgetType.News:
      return `What's New`
    case DashboardWidgetType.Community:
      return 'Community'
    case DashboardWidgetType.GettingStarted:
      return 'Getting Started'
    case DashboardWidgetType.NetWorth:
      return 'Net Worth'
    case DashboardWidgetType.ReviewTransactions:
      return 'Review Transactions'
    case DashboardWidgetType.RecentTransactions:
      return 'Recent Transactions'
    case DashboardWidgetType.Bills:
      return 'Bills'
    case DashboardWidgetType.Budget:
      return 'Budget'
    case DashboardWidgetType.CategorySpending:
      return 'Category Spending'
    case DashboardWidgetType.MonthlySpending:
      return 'Monthly Spending'
    case DashboardWidgetType.RecurringTransactions:
      return 'Recurring Transactions'
    case DashboardWidgetType.Goals:
      return 'Goals'
    case DashboardWidgetType.DateSpending:
      return 'Spending By Date'
  }
}

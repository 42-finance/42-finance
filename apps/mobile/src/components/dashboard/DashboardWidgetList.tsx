import { DashboardWidget } from 'frontend-types'
import React, { memo, useMemo } from 'react'
import { ScrollView } from 'react-native'
import { DashboardWidgetType } from 'shared-types'

import { View } from '../common/View'
import { BillsWidget } from './BillsWidget'
import { BudgetWidget } from './BudgetWidget'
import { CategorySpendingWidget } from './CategorySpendingWidget'
import { CommunityWidget } from './CommunityWidget'
import { DateSpendingWidget } from './DateSpendingWidget'
import { GettingStartedWidget } from './GettingStartedWidget'
import { GoalsWidget } from './GoalsWidget'
import { MonthlySpendingWidget } from './MonthlySpendingWidget'
import { NetWorthWidget } from './NetWorthWidget'
import { NewsWidget } from './NewsWidget'
import { RecentTransactions } from './RecentTransactions'
import { RecurringTransactionsWidget } from './RecurringTransactionsWidget'
import { ReviewTransactions } from './ReviewTransactions'

type Props = {
  widgets: DashboardWidget[]
}

export const WL: React.FC<Props> = ({ widgets }) => {
  const widgetMap = useMemo(() => {
    return {
      [DashboardWidgetType.News]: NewsWidget,
      [DashboardWidgetType.Community]: CommunityWidget,
      [DashboardWidgetType.GettingStarted]: GettingStartedWidget,
      [DashboardWidgetType.NetWorth]: NetWorthWidget,
      [DashboardWidgetType.DateSpending]: DateSpendingWidget,
      [DashboardWidgetType.ReviewTransactions]: ReviewTransactions,
      [DashboardWidgetType.RecentTransactions]: RecentTransactions,
      [DashboardWidgetType.Bills]: BillsWidget,
      [DashboardWidgetType.Budget]: BudgetWidget,
      [DashboardWidgetType.CategorySpending]: CategorySpendingWidget,
      [DashboardWidgetType.MonthlySpending]: MonthlySpendingWidget,
      [DashboardWidgetType.RecurringTransactions]: RecurringTransactionsWidget,
      [DashboardWidgetType.Goals]: GoalsWidget
    }
  }, [])

  return (
    <ScrollView style={{ marginTop: 10 }}>
      {widgets
        .filter((w) => w.isSelected)
        .map((widget) => (
          <View key={widget.type}>{React.createElement(widgetMap[widget.type])}</View>
        ))}
    </ScrollView>
  )
}

export const DashboardWidgetList = memo(WL)

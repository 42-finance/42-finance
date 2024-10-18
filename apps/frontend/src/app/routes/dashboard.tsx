import React from 'react'

import { BudgetWidget } from '../components/dashboard/budget-widget'
import { GettingStartedWidget } from '../components/dashboard/getting-started-widget'
import { NetWorth } from '../components/dashboard/net-worth'
import { RecentTransactions } from '../components/dashboard/recent-transactions'
import { SpendingWidget } from '../components/dashboard/spending-widget'

export const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col p-2 md:p-4 gap-2 md:gap-4">
      <GettingStartedWidget />
      <NetWorth />
      <RecentTransactions />
      <BudgetWidget />
      <SpendingWidget />
    </div>
  )
}

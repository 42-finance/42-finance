import { Feather } from '@expo/vector-icons'
import * as React from 'react'
import { useEffect } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { useTheme } from 'react-native-paper'

import { BillsWidget } from '../components/dashboard/BillsWidget'
import { BudgetWidget } from '../components/dashboard/BudgetWidget'
import { CategorySpendingWidget } from '../components/dashboard/CategorySpendingWidget'
import { CommunityWidget } from '../components/dashboard/CommunityWidget'
import { GettingStartedWidget } from '../components/dashboard/GettingStartedWidget'
import { GoalsWidget } from '../components/dashboard/GoalsWidget'
import { MessageWidget } from '../components/dashboard/MessageWidget'
import { NetWorthWidget } from '../components/dashboard/NetWorthWidget'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { RecurringTransactionsWidget } from '../components/dashboard/RecurringTransactionsWidget'
import { ReviewTransactions } from '../components/dashboard/ReviewTransactions'
import { Spending } from '../components/stats/Spending'
import { RootStackScreenProps } from '../types/root-stack-screen-props'

export const DashboardScreen = ({ navigation }: RootStackScreenProps<'Dashboard'>) => {
  const { colors } = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 15 }}>
          <Feather name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      )
    })
  }, [colors.onSurface, navigation])

  return (
    <ScrollView style={{ marginTop: 10 }}>
      <MessageWidget />
      <CommunityWidget />
      <GettingStartedWidget />
      <NetWorthWidget />
      <ReviewTransactions />
      <RecentTransactions />
      <BillsWidget />
      <BudgetWidget />
      <CategorySpendingWidget />
      <Spending />
      <RecurringTransactionsWidget />
      <GoalsWidget />
    </ScrollView>
  )
}

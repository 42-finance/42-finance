import { Entypo, Feather, FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { RootTabParamList } from '../types/root-tab-params'
import { AccountsNavigator } from './AccountsNavigator'
import { BudgetNavigator } from './BudgetNavigator'
import { CashFlowNavigator } from './CashFlowNavigator'
import { HomeNavigator } from './HomeNavigator'
import { RecurringTransactionsNavigator } from './RecurringTransactionsNavigator'
import { TransactionsNavigator } from './TransactionsNavigator'

const BottomTab = createBottomTabNavigator<RootTabParamList>()

export const HomeTabNavigator = () => {
  return (
    <BottomTab.Navigator initialRouteName="HomeTab">
      <BottomTab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={() => ({
          headerShown: false,
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
        })}
      />
      <BottomTab.Screen
        name="AccountsTab"
        component={AccountsNavigator}
        options={() => ({
          headerShown: false,
          title: 'Accounts',
          tabBarIcon: ({ color }) => <MaterialIcons name="account-balance" size={24} color={color} />
        })}
      />
      <BottomTab.Screen
        name="TransactionsTab"
        component={TransactionsNavigator}
        options={() => ({
          headerShown: false,
          title: 'Transactions',
          tabBarIcon: ({ color }) => <FontAwesome name="credit-card" size={22} color={color} />
        })}
      />
      <BottomTab.Screen
        name="BudgetTab"
        component={BudgetNavigator}
        options={() => ({
          headerShown: false,
          title: 'Budget',
          tabBarIcon: ({ color }) => <FontAwesome6 name="money-bill-trend-up" size={22} color={color} />
        })}
      />
      <BottomTab.Screen
        name="CashFlowTab"
        component={CashFlowNavigator}
        options={() => ({
          headerShown: false,
          title: 'Reports',
          tabBarIcon: ({ color }) => <Entypo name="bar-graph" size={22} color={color} />
        })}
      />
      <BottomTab.Screen
        name="RecurringTransactionsTab"
        component={RecurringTransactionsNavigator}
        options={() => ({
          headerShown: false,
          title: 'Recurring',
          tabBarIcon: ({ color }) => <Feather name="calendar" size={22} color={color} />
        })}
      />
    </BottomTab.Navigator>
  )
}

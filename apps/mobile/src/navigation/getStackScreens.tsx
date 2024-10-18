import { FontAwesome } from '@expo/vector-icons'
import { ParamListBase, StackNavigationState, TypedNavigator } from '@react-navigation/native'
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from '@react-navigation/native-stack'

import { AccountRuleScreen } from '../screens/AccountRuleScreen'
import { AccountScreen } from '../screens/AccountScreen'
import { AccountsScreen } from '../screens/AccountsScreen'
import { AddAccountScreen } from '../screens/AddAccountScreen'
import { AddAssetScreen } from '../screens/AddAssetScreen'
import { AddCategoryScreen } from '../screens/AddCategoryScreen'
import { AddCryptoScreen } from '../screens/AddCryptoScreen'
import { AddGoalScreen } from '../screens/AddGoalScreen'
import { AddGroupScreen } from '../screens/AddGroupScreen'
import { AddPropertyScreen } from '../screens/AddPropertyScreen'
import { AddRecurringTransactionScreen } from '../screens/AddRecurringTransactionScreen'
import { AddRuleScreen } from '../screens/AddRuleScreen'
import { AddTagScreen } from '../screens/AddTagScreen'
import { AddTransactionScreen } from '../screens/AddTransactionScreen'
import { AddVehicleScreen } from '../screens/AddVehicleScreen'
import { AmountsRuleScreen } from '../screens/AmountsRuleScreen'
import { BillScreen } from '../screens/BillScreen'
import { BillsScreen } from '../screens/BillsScreen'
import { BudgetScreen } from '../screens/BudgetScreen'
import { CashFlowScreen } from '../screens/CashFlowScreen'
import { CategoriesScreen } from '../screens/CategoriesScreen'
import { CategoryRuleScreen } from '../screens/CategoryRuleScreen'
import { CategoryScreen } from '../screens/CategoryScreen'
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen'
import { ConnectFinicityScreen } from '../screens/ConnectFinicityScreen'
import { ConnectMxScreen } from '../screens/ConnectMxScreen'
import { ConnectionsScreen } from '../screens/ConnectionsScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { DataScreen } from '../screens/DataScreen'
import { EditAccountScreen } from '../screens/EditAccountScreen'
import { EditCategoryScreen } from '../screens/EditCategoryScreen'
import { EditGoalScreen } from '../screens/EditGoalScreen'
import { EditGroupScreen } from '../screens/EditGroupScreen'
import { EditMerchantScreen } from '../screens/EditMerchantScreen'
import { EditRecurringTransactionScreen } from '../screens/EditRecurringTransactionScreen'
import { EditRuleScreen } from '../screens/EditRuleScreen'
import { EditTagScreen } from '../screens/EditTagScreen'
import { EditTransactionsScreen } from '../screens/EditTransactionsScreen'
import { GoalScreen } from '../screens/GoalScreen'
import { GoalsScreen } from '../screens/GoalsScreen'
import { GroupScreen } from '../screens/GroupScreen'
import { InviteUserScreen } from '../screens/InviteUserScreen'
import { MembersScreen } from '../screens/MembersScreen'
import { MerchantRuleScreen } from '../screens/MerchantRuleScreen'
import { MerchantScreen } from '../screens/MerchantScreen'
import { MerchantsScreen } from '../screens/MerchantsScreen'
import { MonthlyReportScreen } from '../screens/MonthlyReportScreen'
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen'
import { PhotoScreen } from '../screens/PhotoScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { ReassignCategoryScreen } from '../screens/ReassignCategoryScreen'
import { ReassignGroupScreen } from '../screens/ReassignGroupScreen'
import { RecurringTransactionScreen } from '../screens/RecurringTransactionScreen'
import { RecurringTransactionsScreen } from '../screens/RecurringTransactionsScreen'
import { RulesScreen } from '../screens/RulesScreen'
import { SelectAccountScreen } from '../screens/SelectAccountScreen'
import { SelectAmountsScreen } from '../screens/SelectAmountsScreen'
import { SelectCategoryScreen } from '../screens/SelectCategoryScreen'
import { SelectMerchantScreen } from '../screens/SelectMerchantScreen'
import { SelectRecurringTransactionScreen } from '../screens/SelectRecurringTransactionScreen'
import { SelectTagScreen } from '../screens/SelectTagScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { SplitTransactionScreen } from '../screens/SplitTransactionScreen'
import { SubscriptionScreen } from '../screens/SubscriptionScreen'
import { TagsScreen } from '../screens/TagsScreen'
import { TransactionRulesScreen } from '../screens/TransactionRulesScreen'
import { TransactionScreen } from '../screens/TransactionScreen'
import { TransactionsFilterScreen } from '../screens/TransactionsFilterScreen'
import { TransactionsScreen } from '../screens/TransactionsScreen'
import { RootStackParamList } from '../types/root-stack-params'

export const getStackScreens = (
  Stack: TypedNavigator<
    RootStackParamList,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap,
    any
  >
) => {
  return [
    <Stack.Screen key="Account" name="Account" component={AccountScreen} options={{ title: 'Account' }} />,
    <Stack.Screen
      key="AccountRule"
      name="AccountRule"
      component={AccountRuleScreen}
      options={{ title: 'Matches account' }}
    />,
    <Stack.Screen key="Accounts" name="Accounts" component={AccountsScreen} options={() => ({ title: 'Accounts' })} />,
    <Stack.Screen key="AddAccount" name="AddAccount" component={AddAccountScreen} options={{ title: 'Add account' }} />,
    <Stack.Screen key="AddAsset" name="AddAsset" component={AddAssetScreen} options={{ title: 'Add account' }} />,
    <Stack.Screen
      key="AddCategory"
      name="AddCategory"
      component={AddCategoryScreen}
      options={{ title: 'Add category' }}
    />,
    <Stack.Screen key="AddCrypto" name="AddCrypto" component={AddCryptoScreen} options={{ title: 'Add crypto' }} />,
    <Stack.Screen key="AddGoal" name="AddGoal" component={AddGoalScreen} options={{ title: 'Add goal' }} />,
    <Stack.Screen key="AddGroup" name="AddGroup" component={AddGroupScreen} options={{ title: 'Add group' }} />,
    <Stack.Screen
      key="AddProperty"
      name="AddProperty"
      component={AddPropertyScreen}
      options={{ title: 'Add property' }}
    />,
    <Stack.Screen
      key="AddRecurringTransaction"
      name="AddRecurringTransaction"
      component={AddRecurringTransactionScreen}
      options={() => ({ title: 'Add recurring' })}
    />,
    <Stack.Screen key="AddRule" name="AddRule" component={AddRuleScreen} options={{ title: 'Add rule' }} />,
    <Stack.Screen key="AddTag" name="AddTag" component={AddTagScreen} options={{ title: 'Add tag' }} />,
    <Stack.Screen
      key="AddTransaction"
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'Add transaction' }}
    />,
    <Stack.Screen key="AddVehicle" name="AddVehicle" component={AddVehicleScreen} options={{ title: 'Add vehicle' }} />,
    <Stack.Screen
      key="AmountsRule"
      name="AmountsRule"
      component={AmountsRuleScreen}
      options={{ title: 'Matches amount' }}
    />,
    <Stack.Screen key="Bill" name="Bill" component={BillScreen} options={() => ({ title: 'Loading...' })} />,
    <Stack.Screen key="Bills" name="Bills" component={BillsScreen} options={() => ({ title: 'Bills' })} />,
    <Stack.Screen key="Budget" name="Budget" component={BudgetScreen} options={() => ({ title: 'Budget' })} />,
    <Stack.Screen key="CashFlow" name="CashFlow" component={CashFlowScreen} options={() => ({ title: 'Reports' })} />,
    <Stack.Screen key="Categories" name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />,
    <Stack.Screen key="Category" name="Category" component={CategoryScreen} options={{ title: 'Loading...' }} />,
    <Stack.Screen
      key="CategoryRule"
      name="CategoryRule"
      component={CategoryRuleScreen}
      options={{ title: 'Matches category' }}
    />,
    <Stack.Screen
      key="ChangePassword"
      name="ChangePassword"
      component={ChangePasswordScreen}
      options={{ title: 'Change Password' }}
    />,
    <Stack.Screen
      key="ConnectFinicity"
      name="ConnectFinicity"
      component={ConnectFinicityScreen}
      options={{ title: 'Add account' }}
    />,
    <Stack.Screen
      key="Connections"
      name="Connections"
      component={ConnectionsScreen}
      options={{ title: 'Connections' }}
    />,
    <Stack.Screen key="ConnectMx" name="ConnectMx" component={ConnectMxScreen} options={{ title: 'Add account' }} />,
    <Stack.Screen
      key="Dashboard"
      name="Dashboard"
      component={DashboardScreen}
      options={() => ({
        title: 'Dashboard',
        tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="home" size={24} color={color} />
      })}
    />,
    <Stack.Screen key="Data" name="Data" component={DataScreen} options={{ title: 'Data' }} />,
    <Stack.Screen
      key="EditAccount"
      name="EditAccount"
      component={EditAccountScreen}
      options={{ title: 'Edit account' }}
    />,
    <Stack.Screen
      key="EditCategory"
      name="EditCategory"
      component={EditCategoryScreen}
      options={{ title: 'Edit category' }}
    />,
    <Stack.Screen key="EditGoal" name="EditGoal" component={EditGoalScreen} options={{ title: 'Edit goal' }} />,
    <Stack.Screen key="EditGroup" name="EditGroup" component={EditGroupScreen} options={{ title: 'Edit group' }} />,
    <Stack.Screen
      key="EditMerchant"
      name="EditMerchant"
      component={EditMerchantScreen}
      options={{ title: 'Edit merchant' }}
    />,
    <Stack.Screen
      key="EditRecurringTransaction"
      name="EditRecurringTransaction"
      component={EditRecurringTransactionScreen}
      options={() => ({ title: 'Edit recurring' })}
    />,
    <Stack.Screen key="EditRule" name="EditRule" component={EditRuleScreen} options={{ title: 'Edit rule' }} />,
    <Stack.Screen key="EditTag" name="EditTag" component={EditTagScreen} options={{ title: 'Edit tag' }} />,
    <Stack.Screen
      key="EditTransactions"
      name="EditTransactions"
      component={EditTransactionsScreen}
      options={{ title: 'Edit Transactions' }}
    />,
    <Stack.Screen key="Goal" name="Goal" component={GoalScreen} options={{ title: 'Loading...' }} />,
    <Stack.Screen key="Goals" name="Goals" component={GoalsScreen} options={{ title: 'Goals' }} />,
    <Stack.Screen key="Group" name="Group" component={GroupScreen} options={{ title: 'Loading...' }} />,
    <Stack.Screen key="InviteUser" name="InviteUser" component={InviteUserScreen} options={{ title: 'Invite User' }} />,
    <Stack.Screen key="Members" name="Members" component={MembersScreen} options={{ title: 'Members' }} />,
    <Stack.Screen key="Merchant" name="Merchant" component={MerchantScreen} options={{ title: 'Loading...' }} />,
    <Stack.Screen
      key="MerchantRule"
      name="MerchantRule"
      component={MerchantRuleScreen}
      options={{ title: 'Matches merchant' }}
    />,
    <Stack.Screen key="Merchants" name="Merchants" component={MerchantsScreen} options={{ title: 'Merchants' }} />,
    <Stack.Screen
      key="MonthlyReport"
      name="MonthlyReport"
      component={MonthlyReportScreen}
      options={{ title: 'Reports' }}
    />,
    <Stack.Screen
      key="NotificationSettings"
      name="NotificationSettings"
      component={NotificationSettingsScreen}
      options={{ title: 'Notifications' }}
    />,
    <Stack.Screen key="Photo" name="Photo" component={PhotoScreen} options={{ title: 'Photo' }} />,
    <Stack.Screen key="Profile" name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />,
    <Stack.Screen
      key="ReassignCategory"
      name="ReassignCategory"
      component={ReassignCategoryScreen}
      options={{ title: 'Reassign category' }}
    />,
    <Stack.Screen
      key="ReassignGroup"
      name="ReassignGroup"
      component={ReassignGroupScreen}
      options={{ title: 'Reassign group' }}
    />,
    <Stack.Screen key="RecurringTransaction" name="RecurringTransaction" component={RecurringTransactionScreen} />,
    <Stack.Screen
      key="RecurringTransactions"
      name="RecurringTransactions"
      component={RecurringTransactionsScreen}
      options={() => ({ title: 'Recurring' })}
    />,
    <Stack.Screen key="Rules" name="Rules" component={RulesScreen} options={{ title: 'Rules' }} />,
    <Stack.Screen
      key="SelectAccount"
      name="SelectAccount"
      component={SelectAccountScreen}
      options={{ title: 'Select account' }}
    />,
    <Stack.Screen
      key="SelectAmounts"
      name="SelectAmounts"
      component={SelectAmountsScreen}
      options={{ title: 'Amounts' }}
    />,
    <Stack.Screen
      key="SelectCategory"
      name="SelectCategory"
      component={SelectCategoryScreen}
      options={{ title: 'Select a category' }}
    />,
    <Stack.Screen
      key="SelectMerchant"
      name="SelectMerchant"
      component={SelectMerchantScreen}
      options={{ title: 'Select a merchant' }}
    />,
    <Stack.Screen key="SelectTag" name="SelectTag" component={SelectTagScreen} options={{ title: 'Select tag' }} />,
    <Stack.Screen
      key="SelectRecurringTransaction"
      name="SelectRecurringTransaction"
      component={SelectRecurringTransactionScreen}
      options={{ title: 'Select recurring' }}
    />,
    <Stack.Screen key="Settings" name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />,
    <Stack.Screen
      key="SplitTransaction"
      name="SplitTransaction"
      component={SplitTransactionScreen}
      options={{ title: 'Split transaction' }}
    />,
    <Stack.Screen
      key="Subscription"
      name="Subscription"
      component={SubscriptionScreen}
      options={{ title: 'Subscription' }}
    />,
    <Stack.Screen key="Tags" name="Tags" component={TagsScreen} options={{ title: 'Tags' }} />,
    <Stack.Screen
      key="Transaction"
      name="Transaction"
      component={TransactionScreen}
      options={{ title: 'Loading...' }}
    />,
    <Stack.Screen
      key="TransactionRules"
      name="TransactionRules"
      component={TransactionRulesScreen}
      options={{ title: 'Rules' }}
    />,
    <Stack.Screen
      key="Transactions"
      name="Transactions"
      component={TransactionsScreen}
      options={() => ({ title: 'Transactions' })}
    />,
    <Stack.Screen
      key="TransactionsFilter"
      name="TransactionsFilter"
      component={TransactionsFilterScreen}
      options={{ title: 'Filters' }}
    />
  ]
}

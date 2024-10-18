import { Merchant } from 'frontend-types'
import {
  AccountType,
  AmountFilter,
  CategoryType,
  NameFilter,
  NotificationType,
  ReportDateFilter,
  TransactionAmountType
} from 'shared-types'

import { Account } from '../../../../libs/frontend-types/src/account.type'
import { Category } from '../../../../libs/frontend-types/src/category.type'
import { Transaction } from '../../../../libs/frontend-types/src/transaction.type'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Account: { accountId: string }
  Accounts: undefined
  AccountLinking: undefined
  AccountRule: { value: Account | null }
  AddAccount: undefined
  AddAsset: undefined
  AddCategory: undefined
  AddCrypto: undefined
  AddExpense: { propertyId?: number; rentalUnitId?: number }
  AddGoal: undefined
  AddGroup: undefined
  AddProperty: undefined
  AddRecurringTransaction: {
    transactionId?: string
    startDate?: string
    amount?: number
    type?: CategoryType
    account?: Account
    merchant?: Merchant
  }
  AddRule: { merchantName?: string; newCategory?: Category }
  AddTag: undefined
  AddTenant: { rentalUnitId: number }
  AddTransaction: undefined
  AddVehicle: undefined
  AmountsRule: {
    amountType: TransactionAmountType | null
    amountFilter: AmountFilter | null
    amountValue: number | null
    amountValue2: number | null
  }
  Bill: { billId: number }
  Bills: undefined
  Budget: undefined
  Category: { categoryId: number; date?: string; dateFilter: ReportDateFilter }
  CategoryRule: { eventName: string }
  CashFlow: undefined
  Categories: undefined
  ChangePassword: undefined
  Connections: undefined
  ConnectFinicity: { connectUrl: string }
  ConnectMx: { connectUrl: string }
  Dashboard: undefined
  Data: undefined
  EditAccount: { accountId: string }
  EditCategory: { categoryId: number }
  EditGoal: { goalId: number }
  EditGroup: { groupId: number }
  EditMerchant: { merchantId: number }
  EditProperty: { propertyId: number }
  EditRecurringTransaction: { recurringTransactionId: number }
  EditRentalUnit: { rentalUnitId: number }
  EditRule: { ruleId: number }
  EditTag: { tagId: number }
  EditTenant: { tenantId: number }
  EditTransactions: { transactions: Transaction[] }
  ForgotPassword: undefined
  Goal: { goalId: number }
  Goals: undefined
  Group: { groupId: number; date: string; dateFilter: ReportDateFilter }
  InviteUser: undefined
  Members: undefined
  Merchant: { merchantId: number; date?: string; dateFilter: ReportDateFilter }
  MerchantRule: {
    merchantValueFilter: NameFilter | null
    merchantName: string | null
    merchantOriginalStatement: string | null
  }
  MonthlyReport: { date: string; dateFilter: ReportDateFilter }
  Login: undefined
  RecurringTransaction: { recurringTransactionId: number }
  RecurringTransactions: undefined
  Register: undefined
  RootTabs: undefined
  ReassignCategory: { categoryId: number; categoryIcon: string; categoryName: string }
  ReassignGroup: { groupId: number; groupName: string; categoryCount: number }
  Rules: undefined
  Photo: { transactionId: string; attachment: string }
  Profile: undefined
  ManagePayments: undefined
  Merchants: undefined
  NotificationSetting: {
    type: NotificationType
    sendPushNotification: boolean
    sendEmail: boolean
    minimumAmount: number | null
  }
  NotificationSettings: undefined
  RentalUnit: { rentalUnitId: number }
  Tags: undefined
  Transaction: { transactionId: string }
  Transactions: undefined
  TransactionRules: { transactionId: string }
  TransactionsFilter: undefined
  SelectAccount: { accountIds: string[]; eventName: string; multiple: boolean; accountTypes?: AccountType[] }
  SelectAmounts: {
    eventName: string
    defaultAmountType: TransactionAmountType | null
    defaultAmountFilter: AmountFilter | null
    defaultAmountValue: number | null
    defaultAmountValue2: number | null
  }
  SelectCategory: { categoryIds: number[]; eventName: string; multiple: boolean }
  SelectMerchant: { merchantIds: number[]; eventName: string; multiple: boolean }
  SelectRecurringTransaction: { recurringTransactionIds: number[]; eventName: string; multiple: boolean }
  SelectTag: { tagIds: number[]; eventName: string }
  Settings: undefined
  Subscription: undefined
  SplitTransaction: { transactionId: string }
  Expenses: { propertyId?: number; rentalUnitId?: number }
  Expense: { expenseId: number }
  EditExpense: { expenseId: number }
  // Tabs
  HomeTab: undefined
  AccountsTab: undefined
  TransactionsTab: undefined
  CashFlowTab: undefined
  BudgetTab: undefined
  RecurringTransactionsTab: undefined
}

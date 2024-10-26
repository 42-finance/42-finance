import { DataSource } from 'typeorm'

import { config } from './common/config'
import { initializeDatabase } from './common/initialize-database'
import { Account } from './models/account'
import { AccountGroup } from './models/account-group'
import { BalanceHistory } from './models/balance-history'
import { Bill } from './models/bill'
import { BillPayment } from './models/bill-payment'
import { Budget } from './models/budget'
import { Category } from './models/category'
import { Connection } from './models/connection'
import { DashboardWidget } from './models/dashboard-widget'
import { EntityType } from './models/entity-type'
import { ExchangeRate } from './models/exchange-rate'
import { Expense } from './models/expense'
import { Goal } from './models/goal'
import { Group } from './models/group'
import { Household } from './models/household'
import { HouseholdUser } from './models/household-user'
import { Invoice } from './models/invoice'
import { Merchant } from './models/merchant'
import { NotificationSetting } from './models/notification-setting'
import { NotificationToken } from './models/notification-token'
import { Property } from './models/property'
import { RecurringTransaction } from './models/recurring-transaction'
import { Referral } from './models/referral'
import { RentalUnit } from './models/rental-unit'
import { Rule } from './models/rule'
import { Tag } from './models/tag'
import { Tenant } from './models/tenant'
import { Transaction } from './models/transaction'
import { User } from './models/user'
import { UserInvite } from './models/user-invite'
import { getCategory } from './utils/category.utils'
import { getWalletBalance, getWalletTransactions, updateWalletTransactions } from './utils/covalent.utils'
import { getOrCreateMerchant } from './utils/merchant.utils'
import { createOrUpdateRecurringTransaction } from './utils/recurring.utils'
import { applyRules } from './utils/rule.utils'
import { getVehicleValue } from './utils/vehicle.utils'

const dataSource = new DataSource(config)

export {
  Account,
  AccountGroup,
  applyRules,
  BalanceHistory,
  Bill,
  BillPayment,
  Budget,
  Category,
  Connection,
  createOrUpdateRecurringTransaction,
  DashboardWidget,
  dataSource,
  EntityType,
  ExchangeRate,
  Expense,
  getCategory,
  getOrCreateMerchant,
  getVehicleValue,
  getWalletBalance,
  getWalletTransactions,
  Goal,
  Group,
  Household,
  HouseholdUser,
  initializeDatabase,
  Invoice,
  Merchant,
  NotificationSetting,
  NotificationToken,
  Property,
  RecurringTransaction,
  Referral,
  RentalUnit,
  Rule,
  Tag,
  Tenant,
  Transaction,
  updateWalletTransactions,
  User,
  UserInvite
}

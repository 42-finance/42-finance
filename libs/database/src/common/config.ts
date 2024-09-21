import dotenv from 'dotenv'

import { Account } from '../models/account'
import { BalanceHistory } from '../models/balance-history'
import { Bill } from '../models/bill'
import { BillPayment } from '../models/bill-payment'
import { Budget } from '../models/budget'
import { Category } from '../models/category'
import { Connection } from '../models/connection'
import { DashboardWidget } from '../models/dashboard-widget'
import { ExchangeRate } from '../models/exchange-rate'
import { Expense } from '../models/expense'
import { Goal } from '../models/goal'
import { Group } from '../models/group'
import { Household } from '../models/household'
import { HouseholdUser } from '../models/household-user'
import { Invoice } from '../models/invoice'
import { Merchant } from '../models/merchant'
import { NotificationSetting } from '../models/notification-setting'
import { NotificationToken } from '../models/notification-token'
import { Property } from '../models/property'
import { RecurringTransaction } from '../models/recurring-transaction'
import { Referral } from '../models/referral'
import { RentalUnit } from '../models/rental-unit'
import { Rule } from '../models/rule'
import { SupportTicket } from '../models/support-ticket'
import { SupportTicketComment } from '../models/support-ticket-comment'
import { Tag } from '../models/tag'
import { Tenant } from '../models/tenant'
import { Transaction } from '../models/transaction'
import { User } from '../models/user'
import { UserInvite } from '../models/user-invite'

dotenv.config()

const sslConfig =
  process.env.SSL === 'true'
    ? {
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      }
    : {}

export const config = {
  type: 'postgres' as 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  logging: process.env.DATABASE_LOGGING === 'true',
  migrations: [`${__dirname}/../migrations/*.*`],
  entities: [
    Account,
    BalanceHistory,
    Bill,
    BillPayment,
    Budget,
    Category,
    Connection,
    DashboardWidget,
    ExchangeRate,
    Expense,
    Goal,
    Group,
    Household,
    HouseholdUser,
    Invoice,
    Merchant,
    NotificationSetting,
    NotificationToken,
    Property,
    RecurringTransaction,
    Referral,
    RentalUnit,
    Rule,
    SupportTicket,
    SupportTicketComment,
    Tag,
    Tenant,
    Transaction,
    User,
    UserInvite
  ],
  ...sslConfig
}

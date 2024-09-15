import { Expense } from './expense'
import { Invoice } from './invoice'
import { Property } from './property'
import { RentalUnit } from './rental-unit'
import { Tenant } from './tenant'
import { Transaction } from './transaction'
import { User } from './user'

export type EntityType =
  | typeof Expense
  | typeof Invoice
  | typeof Tenant
  | typeof Transaction
  | typeof RentalUnit
  | typeof Property
  | typeof User

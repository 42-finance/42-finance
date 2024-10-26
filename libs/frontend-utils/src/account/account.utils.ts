import { addDays } from 'date-fns'
import { Account, AccountGroup, BalanceHistory, Transaction } from 'frontend-types'
import _ from 'lodash'
import { AccountSubType, AccountType, CategoryType, CurrencyCode } from 'shared-types'

import { todayInUtc } from '../date/date.utils'
import { formatDollars } from '../invoice/invoice.utils'

type AccountBase = {
  type: AccountType
  subType: AccountSubType
  currentBalance: number
  convertedBalance: number
  accountGroupId: number
}

export const getNetWorth = (
  accounts: AccountBase[],
  accountGroup: AccountGroup | null,
  convertBalance: boolean,
  invertLiabilities: boolean
) => {
  let value = 0
  for (const account of accounts) {
    value += getAccountValue(account, accountGroup, convertBalance, invertLiabilities)
  }
  return value
}

const getAccounts = (balanceHistory: BalanceHistory[]) => {
  const accounts: Account[] = []
  for (const history of balanceHistory) {
    if (history.account && accounts.find((a) => a.id === history.accountId) == null) {
      accounts.push(history.account)
    }
  }
  return accounts
}

const getHistoryForAccount = (balanceHistory: BalanceHistory[], account: Account, date: Date) => {
  let accountHistory: BalanceHistory | null = null

  for (const history of balanceHistory) {
    if (history.date.getTime() > date.getTime()) {
      return accountHistory
    }
    if (history.accountId === account.id) {
      accountHistory = history
    }
  }

  return accountHistory
}

const getNetWorthForDate = (
  balanceHistory: BalanceHistory[],
  accountGroup: AccountGroup | null,
  date: Date,
  convertBalance: boolean,
  invertLiabilities: boolean
) => {
  const sortedBalanceHistory = balanceHistory.sort((a, b) => a.date.getTime() - b.date.getTime())
  const accounts = getAccounts(balanceHistory)
  let value = 0
  for (const account of accounts) {
    const history = getHistoryForAccount(sortedBalanceHistory, account, date)
    if (history) {
      value += getAccountValue(
        {
          type: account.type,
          subType: account.subType,
          currentBalance: history.currentBalance,
          convertedBalance: history.convertedBalance,
          accountGroupId: account.accountGroupId
        },
        accountGroup,
        convertBalance,
        invertLiabilities
      )
    }
  }
  return value
}

export const getNetWorthHistory = (
  balanceHistory: BalanceHistory[],
  accountGroup: AccountGroup | null,
  convertBalance: boolean,
  invertLiabilities: boolean,
  startDate: Date | null
) => {
  let sortedBalanceHistory = balanceHistory.sort((a, b) => a.date.getTime() - b.date.getTime())
  if (startDate) {
    sortedBalanceHistory = sortedBalanceHistory.filter((b) => b.date.getTime() >= startDate.getTime())
  }
  if (sortedBalanceHistory.length === 0) {
    return []
  }

  let date = sortedBalanceHistory[0].date
  const tomorrow = addDays(todayInUtc(), 1)
  const values: { date: Date; value: number }[] = []

  while (date.getTime() <= tomorrow.getTime()) {
    const value = getNetWorthForDate(balanceHistory, accountGroup, date, convertBalance, invertLiabilities)
    values.push({ date, value })
    date = addDays(date, 1)
  }

  return values
}

export const getAccountValue = (
  account: AccountBase,
  accountGroup: AccountGroup | null,
  convertBalance: boolean,
  invertLiabilities: boolean
) => {
  if (accountGroup == null || account.accountGroupId === accountGroup.id) {
    switch (account.type) {
      case AccountType.Liability: {
        if (invertLiabilities) {
          return convertBalance ? -account.convertedBalance : -account.currentBalance
        } else {
          return convertBalance ? account.convertedBalance : account.currentBalance
        }
      }
      case AccountType.Asset:
        return convertBalance ? account.convertedBalance : account.currentBalance
    }
  }
  return 0
}

export const getMonthlyValueChange = (
  balanceHistory: BalanceHistory[],
  accountGroup: AccountGroup | null,
  startDate: Date,
  endDate: Date,
  convertBalance: boolean,
  invertLiabilities: boolean
) => {
  const startValue = getNetWorthForDate(balanceHistory, accountGroup, startDate, convertBalance, invertLiabilities)
  const currentValue = getNetWorthForDate(balanceHistory, accountGroup, endDate, convertBalance, invertLiabilities)
  return {
    value: currentValue - startValue,
    percentage: startValue === 0 ? 100 : ((currentValue - startValue) / Math.abs(startValue)) * 100
  }
}

export const getDailySpending = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  let currentDate = startDate
  const spending: { value: number; date: Date; dailyValue: number }[] = []
  let lastValue = 0
  while (currentDate.getTime() <= endDate.getTime()) {
    const transactionsToDate = transactions
      .filter((t) => t.category.group.type === CategoryType.Expense)
      .filter((t) => t.date.getTime() <= currentDate.getTime())
    const toDateValue = _.sumBy(transactionsToDate, 'convertedAmount')
    spending.push({ value: toDateValue, date: currentDate, dailyValue: toDateValue - lastValue })
    lastValue = toDateValue
    currentDate = addDays(currentDate, 1)
  }
  return spending
}

export const formatAccountName = (account: Account) => {
  if (account.mask) {
    return `${account.name} (...${account.mask})`
  }
  return account.name
}

export const formatAccountBalance = (account: Account, currencyCode: CurrencyCode) => {
  let balance = formatDollars(
    account.subType === AccountSubType.CryptoExchange || account.subType === AccountSubType.Vehicle
      ? account.convertedBalance
      : account.currentBalance,
    account.currencyCode
  )
  if (
    account.currencyCode !== currencyCode &&
    account.subType !== AccountSubType.CryptoExchange &&
    account.subType !== AccountSubType.Vehicle
  ) {
    balance += ` ${account.currencyCode}`
  }
  return balance
}

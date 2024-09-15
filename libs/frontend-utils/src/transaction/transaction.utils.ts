import { getQuarter, getWeek, startOfDay, startOfQuarter, startOfWeek } from 'date-fns'
import { sumBy } from 'lodash'
import { CashFlowFilter } from 'shared-types'

import { Category } from '../../../frontend-types/src/category.type'
import { Group } from '../../../frontend-types/src/group.type'
import { Merchant } from '../../../frontend-types/src/merchant.type'
import { Transaction } from '../../../frontend-types/src/transaction.type'
import { dateToLocal, dateToUtc } from '../date/date.utils'

export type GroupedTransaction<T> = {
  key: T
  transactions: Transaction[]
}

export const groupTransactions = (transactions: Transaction[], filter: CashFlowFilter) => {
  switch (filter) {
    case CashFlowFilter.Category:
      return groupTransactionsByCategory(transactions)
    case CashFlowFilter.Group:
      return groupTransactionsByGroup(transactions)
    case CashFlowFilter.Merchant:
      return groupTransactionsByMerchant(transactions)
  }
}

export const groupTransactionsByCategory = (transactions: Transaction[]) => {
  const sortedItems = transactions.sort((a, b) => a.categoryId - b.categoryId)
  const totalValue = sumBy(transactions, 'convertedAmount')
  return sortedItems
    .reduce<GroupedTransaction<Category>[]>((acc, transaction) => {
      const lastGroup = acc[acc.length - 1]
      if (lastGroup && lastGroup.key.id === transaction.categoryId) {
        lastGroup.transactions.push(transaction)
      } else {
        acc.push({ key: transaction.category, transactions: [transaction] })
      }
      return acc
    }, [])
    .map(({ key, transactions }) => {
      const value = sumBy(transactions, 'convertedAmount')
      return {
        key,
        value,
        percentage: (value / totalValue) * 100
      }
    })
    .sort((a, b) => b.value - a.value)
}

export const groupTransactionsByGroup = (transactions: Transaction[]) => {
  const sortedItems = transactions.sort((a, b) => a.category.groupId - b.category.groupId)
  const totalValue = sumBy(transactions, 'convertedAmount')
  return sortedItems
    .reduce<GroupedTransaction<Group>[]>((acc, transaction) => {
      const lastGroup = acc[acc.length - 1]
      if (lastGroup && lastGroup.key.id === transaction.category.groupId) {
        lastGroup.transactions.push(transaction)
      } else {
        acc.push({ key: transaction.category.group, transactions: [transaction] })
      }
      return acc
    }, [])
    .map(({ key, transactions }) => {
      const value = sumBy(transactions, 'convertedAmount')
      return {
        key,
        value,
        percentage: (value / totalValue) * 100
      }
    })
    .sort((a, b) => b.value - a.value)
}

export const groupTransactionsByMerchant = (transactions: Transaction[]) => {
  const sortedItems = transactions.sort((a, b) => a.merchantId - b.merchantId)
  const totalValue = sumBy(transactions, 'convertedAmount')
  return sortedItems
    .reduce<GroupedTransaction<Merchant>[]>((acc, transaction) => {
      const lastGroup = acc[acc.length - 1]
      if (lastGroup && lastGroup.key.id === transaction.merchantId) {
        lastGroup.transactions.push(transaction)
      } else {
        acc.push({ key: transaction.merchant, transactions: [transaction] })
      }
      return acc
    }, [])
    .map(({ key, transactions }) => {
      const value = sumBy(transactions, 'convertedAmount')
      return {
        key,
        value,
        percentage: (value / totalValue) * 100
      }
    })
    .sort((a, b) => b.value - a.value)
}

export const groupTransactionsByYear = (transactions: Transaction[]) => {
  const transactionsCopy = [...transactions]
  const sortedItems = transactionsCopy.sort((a, b) => a.date.getTime() - b.date.getTime())
  return sortedItems.reduce<GroupedTransaction<Date>[]>((acc, transaction) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && lastGroup.key.getUTCFullYear() === transaction.date.getUTCFullYear()) {
      lastGroup.transactions.push(transaction)
    } else {
      acc.push({
        key: dateToUtc(new Date(transaction.date.getUTCFullYear(), 1, 1)),
        transactions: [transaction]
      })
    }
    return acc
  }, [])
}

export const groupTransactionsByQuarter = (transactions: Transaction[]) => {
  const transactionsCopy = [...transactions]
  const sortedItems = transactionsCopy.sort((a, b) => a.date.getTime() - b.date.getTime())
  return sortedItems.reduce<GroupedTransaction<Date>[]>((acc, transaction) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && getQuarter(dateToLocal(lastGroup.key)) === getQuarter(dateToLocal(transaction.date))) {
      lastGroup.transactions.push(transaction)
    } else {
      acc.push({
        key: dateToUtc(startOfQuarter(dateToLocal(transaction.date))),
        transactions: [transaction]
      })
    }
    return acc
  }, [])
}

export const groupTransactionsByMonth = (transactions: Transaction[]) => {
  const transactionsCopy = [...transactions]
  const sortedItems = transactionsCopy.sort((a, b) => a.date.getTime() - b.date.getTime())
  return sortedItems.reduce<GroupedTransaction<Date>[]>((acc, transaction) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && lastGroup.key.getUTCMonth() === transaction.date.getUTCMonth()) {
      lastGroup.transactions.push(transaction)
    } else {
      acc.push({
        key: dateToUtc(new Date(transaction.date.getUTCFullYear(), transaction.date.getUTCMonth(), 1)),
        transactions: [transaction]
      })
    }
    return acc
  }, [])
}

export const groupTransactionsByWeek = (transactions: Transaction[]) => {
  const transactionsCopy = [...transactions]
  const sortedItems = transactionsCopy.sort((a, b) => a.date.getTime() - b.date.getTime())
  return sortedItems.reduce<GroupedTransaction<Date>[]>((acc, transaction) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && getWeek(dateToLocal(lastGroup.key)) === getWeek(dateToLocal(transaction.date))) {
      lastGroup.transactions.push(transaction)
    } else {
      acc.push({
        key: dateToUtc(startOfWeek(dateToLocal(transaction.date))),
        transactions: [transaction]
      })
    }
    return acc
  }, [])
}

export const groupTransactionsByDay = (transactions: Transaction[]) => {
  const sortedItems = transactions.sort((a, b) => a.date.getTime() - b.date.getTime())
  return sortedItems.reduce<GroupedTransaction<Date>[]>((acc, transaction) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && lastGroup.key.getTime() === dateToUtc(startOfDay(dateToLocal(transaction.date))).getTime()) {
      lastGroup.transactions.push(transaction)
    } else {
      acc.push({
        key: dateToUtc(startOfDay(dateToLocal(transaction.date))),
        transactions: [transaction]
      })
    }
    return acc
  }, [])
}

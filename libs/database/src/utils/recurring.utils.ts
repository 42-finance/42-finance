import { CategoryType, Frequency } from 'shared-types'

import { RecurringTransaction, dataSource } from '..'
import { Transaction } from '../models/transaction'

const millisecondsInDay = 1000 * 60 * 60 * 24

const isSameDayOfMonth = (dates: Date[]) => {
  const day = dates[0].getDate()
  return dates.every((date) => date.getDate() === day)
}

const isFixedInterval = (dates: Date[], interval: number) => {
  for (let i = 1; i < dates.length; i++) {
    const diff = (dates[i].getTime() - dates[i - 1].getTime()) / millisecondsInDay
    if (Math.abs(diff - interval) > 1) return false
  }
  return true
}

const isSameDayOfWeekInMonth = (dates: Date[]) => {
  const firstDate = dates[0]
  const nthWeekday = Math.ceil(firstDate.getDate() / 7)
  const dayOfWeek = firstDate.getDay()
  return dates.every((date) => {
    const nth = Math.ceil(date.getDate() / 7)
    return nth === nthWeekday && date.getDay() === dayOfWeek
  })
}

const isLastDayOfMonth = (date: Date) => {
  const nextDay = new Date(date.getTime())
  nextDay.setDate(date.getDate() + 1)
  return nextDay.getDate() === 1
}

const isLastSpecificWeekday = (dates: Date[]) => {
  return dates.every((date) => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    const lastSpecificWeekday = lastDayOfMonth.getDate() - ((lastDayOfMonth.getDay() - date.getDay() + 7) % 7)
    return date.getDate() === lastSpecificWeekday
  })
}

const averageInterval = (dates: Date[]) => {
  const intervals = dates
    .map((date, i) => (i > 0 ? (date.getTime() - dates[i - 1].getTime()) / millisecondsInDay : 0))
    .slice(1)
  return intervals.reduce((a, b) => a + b, 0) / intervals.length
}

type RecurrenceInfo = {
  isRecurring: boolean
  startDate?: Date
  frequency?: Frequency
  interval?: number
  patternDescription?: string
}

export const getRecurrenceInfo = async (
  transaction: Transaction,
  pastTransactions: Transaction[]
): Promise<RecurrenceInfo> => {
  if (pastTransactions.length < 2) {
    return { isRecurring: false }
  }

  const dates = [...pastTransactions.map((t) => t.date), new Date(transaction.date)].sort(
    (a, b) => a.getTime() - b.getTime()
  )

  // 1. Daily Pattern
  if (isFixedInterval(dates, 1)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.Daily,
      patternDescription: 'Occurs daily'
    }
  }

  // 2. Weekly Pattern
  if (isFixedInterval(dates, 7)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.Weekly,
      patternDescription: `Occurs every ${dates[0].toLocaleString('en-US', { weekday: 'long' })}`
    }
  }

  // 3. Biweekly Pattern
  if (isFixedInterval(dates, 14)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.BiWeekly,
      patternDescription: `Occurs every two weeks on ${dates[0].toLocaleString('en-US', { weekday: 'long' })}`
    }
  }

  // 4. Semi-Monthly Pattern
  if (isFixedInterval(dates, 15)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.SemiMonthly,
      patternDescription: 'Occurs semi-monthly'
    }
  }

  // 5. Monthly on the Same Date
  if (isSameDayOfMonth(dates)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.MonthlyExactDay,
      patternDescription: `Occurs on the ${dates[0].getDate()}th of every month`
    }
  }

  // 6. Monthly on the Same Day of the Week
  if (isSameDayOfWeekInMonth(dates)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.MonthlyDayOfWeek,
      patternDescription: `Occurs on the ${Math.ceil(dates[0].getDate() / 7)}th ${dates[0].toLocaleString('en-US', { weekday: 'long' })} of every month`
    }
  }

  // 7. Monthly on the Last Day
  if (dates.every(isLastDayOfMonth)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.MonthlyLastDay,
      patternDescription: 'Occurs on the last day of every month'
    }
  }

  // 8. Monthly on the Last Specific Weekday
  if (isLastSpecificWeekday(dates)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.MonthlyLastWeekday,
      patternDescription: `Occurs on the last ${dates[0].toLocaleString('en-US', { weekday: 'long' })} of every month`
    }
  }

  // 9. Quarterly
  if (isFixedInterval(dates, 90)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.Quarterly,
      patternDescription: 'Occurs every three months'
    }
  }

  // 10. Bi-Monthly
  if (isFixedInterval(dates, 60)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.BiMonthly,
      patternDescription: 'Occurs every two months'
    }
  }

  // 11. Yearly on the Same Date
  if (isFixedInterval(dates, 365)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.YearlyExactDay,
      patternDescription: `Occurs on the ${dates[0].getDate()}th of ${dates[0].toLocaleString('en-US', { month: 'long' })} every year`
    }
  }

  // 12. Yearly on the Same Day of the Week
  if (dates.every((date) => date.getDay() === dates[0].getDay() && date.getMonth() === dates[0].getMonth())) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.YearlyDayOfWeek,
      patternDescription: `Occurs on the ${Math.ceil(dates[0].getDate() / 7)}th ${dates[0].toLocaleString('en-US', { weekday: 'long' })} of ${dates[0].toLocaleString('en-US', { month: 'long' })} every year`
    }
  }

  const interval = Math.ceil(averageInterval(dates))

  // 13. Fixed Interval (Custom)
  if (isFixedInterval(dates, interval)) {
    return {
      isRecurring: true,
      startDate: dates[0],
      frequency: Frequency.FixedInterval,
      interval,
      patternDescription: `Occurs every ${interval} days`
    }
  }

  return { isRecurring: false }
}

export const createOrUpdateRecurringTransaction = async (transaction: Transaction, householdId: number) => {
  const pastTransactions = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .andWhere('transaction.householdId = :householdId', { householdId })
    .andWhere('transaction.accountId = :accountId', { accountId: transaction.accountId })
    .andWhere('transaction.merchantId = :merchantId', { merchantId: transaction.merchantId })
    .andWhere('transaction.amount = :amount', { amount: transaction.amount })
    .andWhere('transaction.id != :transactionId', { transactionId: transaction.id })
    .andWhere('transaction.date != :date', { date: transaction.date })
    .orderBy('transaction.date')
    .getMany()

  const recurrenceInfo = await getRecurrenceInfo(transaction, pastTransactions)

  if (recurrenceInfo.isRecurring) {
    let recurringTransactionId: number | null = null

    for (const pastTransaction of pastTransactions) {
      if (pastTransaction.recurringTransactionId) {
        recurringTransactionId = pastTransaction.recurringTransactionId
        break
      }
    }

    if (recurringTransactionId == null) {
      const savedRecurring = await dataSource.getRepository(RecurringTransaction).save({
        name: '',
        startDate: recurrenceInfo.startDate,
        frequency: recurrenceInfo.frequency,
        interval: recurrenceInfo.interval,
        amount: Math.abs(transaction.amount),
        type: transaction.amount < 0 ? CategoryType.Income : CategoryType.Expense,
        status: true,
        accountId: transaction.accountId,
        merchantId: transaction.merchantId,
        householdId
      })
      recurringTransactionId = savedRecurring.id
    } else if (new Date(transaction.date).getTime() < pastTransactions[pastTransactions.length - 1].date.getTime()) {
      await dataSource.getRepository(RecurringTransaction).update(recurringTransactionId, {
        startDate: recurrenceInfo.startDate,
        frequency: recurrenceInfo.frequency,
        interval: recurrenceInfo.interval
      })
    }

    await dataSource
      .getRepository(Transaction)
      .update([...pastTransactions.map((t) => t.id), transaction.id], { recurringTransactionId })
  }
}

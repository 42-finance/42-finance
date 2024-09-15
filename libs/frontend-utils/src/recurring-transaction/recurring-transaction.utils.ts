import { endOfMonth } from 'date-fns'
import { RecurringTransaction } from 'frontend-types'
import _ from 'lodash'
import { Frequency } from 'shared-types'

import { dateToLocal, dateToUtc, formatDateInUtc, todayInUtc } from '../date/date.utils'

const getRecurringDates = (
  startDate: Date,
  endDate: Date | null,
  frequency: Frequency,
  interval: number | null
): Date[] => {
  const today = todayInUtc()
  const dates: Date[] = []
  const currentDate = new Date(startDate)
  let noEndDate = false

  if (endDate == null) {
    noEndDate = true
    endDate = new Date(8_640_000_000_000_000)
  }

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))

    if (noEndDate && currentDate.getTime() > today.getTime()) {
      break
    }

    const dayOfWeek = currentDate.getDay()

    switch (frequency) {
      case Frequency.Daily:
        currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        break
      case Frequency.Weekly:
        currentDate.setUTCDate(currentDate.getUTCDate() + 7)
        break
      case Frequency.BiWeekly:
        currentDate.setUTCDate(currentDate.getUTCDate() + 14)
        break
      case Frequency.SemiMonthly:
        currentDate.setUTCDate(
          currentDate.getUTCDate() +
            (currentDate.getUTCDate() <= 15 ? 15 - currentDate.getUTCDate() : 30 - currentDate.getUTCDate())
        )
        break
      case Frequency.MonthlyExactDay: {
        const month = currentDate.getUTCMonth()
        currentDate.setUTCMonth(month + 1)
        break
      }
      case Frequency.MonthlyDayOfWeek: {
        const nthWeek = Math.ceil(currentDate.getUTCDate() / 7)
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1)
        currentDate.setUTCDate(1)
        let count = 0
        while (count < nthWeek) {
          if (currentDate.getUTCDay() === dayOfWeek) count++
          if (count < nthWeek) currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        }
        break
      }
      case Frequency.MonthlyLastDay: {
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1)
        currentDate.setUTCDate(0) // Last day of the previous month
        break
      }
      case Frequency.MonthlyLastWeekday: {
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 1)
        const lastDayOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0)
        const lastSpecificWeekday =
          lastDayOfMonth.getUTCDate() - ((lastDayOfMonth.getUTCDay() - currentDate.getUTCDay() + 7) % 7)
        currentDate.setUTCDate(lastSpecificWeekday)
        break
      }
      case Frequency.Quarterly:
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 3)
        break
      case Frequency.BiMonthly:
        currentDate.setUTCMonth(currentDate.getUTCMonth() + 2)
        break
      case Frequency.YearlyExactDay:
        currentDate.setUTCFullYear(currentDate.getUTCFullYear() + 1)
        break
      case Frequency.YearlyDayOfWeek: {
        const monthInYear = currentDate.getUTCMonth()
        const nthWeekInYear = Math.ceil(currentDate.getUTCDate() / 7)
        currentDate.setUTCFullYear(currentDate.getUTCFullYear() + 1)
        currentDate.setUTCMonth(monthInYear)
        currentDate.setUTCDate(1)
        let count = 0
        while (count < nthWeekInYear) {
          if (currentDate.getUTCDay() === dayOfWeek) count++
          if (count < nthWeekInYear) currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        }
        break
      }
      case Frequency.FixedInterval: {
        if (interval) {
          currentDate.setUTCDate(currentDate.getUTCDate() + interval)
        } else {
          return []
        }
        break
      }
      default:
        return []
    }
  }

  return dates
}

export const getRecurringDatesForMonth = (
  selectedMonth: Date,
  startDate: Date,
  frequency: Frequency,
  interval: number | null
) => {
  const endOfMonthDate = dateToUtc(endOfMonth(dateToLocal(selectedMonth)))
  const allDates = getRecurringDates(startDate, endOfMonthDate, frequency, interval)
  return allDates.filter((d) => d.getUTCMonth() === selectedMonth.getUTCMonth())
}

export const getNextRecurringDate = (startDate: Date, frequency: Frequency, interval: number | null) => {
  const today = todayInUtc()
  const allDates = getRecurringDates(startDate, null, frequency, interval)
  return allDates.find((d) => d.getTime() > today.getTime())
}

const formatDateWithSuffix = (day: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const relevantDigits = day % 10

  if (day % 100 >= 11 && day % 100 <= 13) {
    return `${day}th`
  }

  const suffix = suffixes[relevantDigits] || suffixes[0]

  return `${day}${suffix}`
}

export const formatFrequency = (startDate: Date, frequency: Frequency, interval: number | null) => {
  switch (frequency) {
    case Frequency.Daily:
      return 'Occurs daily'
    case Frequency.Weekly:
      return `Occurs every ${formatDateInUtc(startDate, 'EEEE')}`
    case Frequency.BiWeekly:
      return `Occurs every two weeks on ${formatDateInUtc(startDate, 'EEEE')}`
    case Frequency.SemiMonthly:
      return 'Occurs semi-monthly'
    case Frequency.MonthlyExactDay:
      return `Occurs on the ${formatDateWithSuffix(startDate.getUTCDate())} of every month`
    case Frequency.MonthlyDayOfWeek:
      return `Occurs on the ${formatDateWithSuffix(Math.ceil(startDate.getUTCDate() / 7))}${formatDateInUtc(startDate, 'EEEE')} of every month`
    case Frequency.MonthlyLastDay:
      return 'Occurs on the last day of every month'
    case Frequency.MonthlyLastWeekday:
      return `Occurs on the last ${formatDateInUtc(startDate, 'EEEE')} of every month`
    case Frequency.Quarterly:
      return 'Occurs every three months'
    case Frequency.BiMonthly:
      return 'Occurs every two months'
    case Frequency.YearlyExactDay:
      return `Occurs on the ${formatDateWithSuffix(startDate.getUTCDate())} of ${formatDateInUtc(startDate, 'MMMM')} every year`
    case Frequency.YearlyDayOfWeek:
      return `Occurs on the ${formatDateWithSuffix(Math.ceil(startDate.getUTCDate() / 7))} ${formatDateInUtc(startDate, 'EEEE')} of ${formatDateInUtc(startDate, 'MMMM')} every year`
    case Frequency.FixedInterval:
      return `Occurs every ${interval} days`
  }
}

export const formatRecurringTransaction = (recurringTransaction: RecurringTransaction) => {
  if (_.isEmpty(recurringTransaction.name)) {
    return recurringTransaction.merchant.name
  }

  return recurringTransaction.name
}

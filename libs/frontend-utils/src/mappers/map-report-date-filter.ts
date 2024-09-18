import { endOfMonth, endOfQuarter, endOfWeek } from 'date-fns'
import { Transaction } from 'frontend-types'
import { ReportDateFilter } from 'shared-types'

import { dateToLocal, dateToUtc, formatDateInUtc } from '../date/date.utils'

export const mapReportDateFilter = (reportDateFilter: ReportDateFilter) => {
  switch (reportDateFilter) {
    case ReportDateFilter.Weekly:
      return 'Weekly'
    case ReportDateFilter.Monthly:
      return 'Monthly'
    case ReportDateFilter.Quarterly:
      return 'Quarterly'
    case ReportDateFilter.Yearly:
      return 'Yearly'
  }
}

export const mapReportDateFilterShort = (reportDateFilter: ReportDateFilter) => {
  switch (reportDateFilter) {
    case ReportDateFilter.Weekly:
      return 'Week'
    case ReportDateFilter.Monthly:
      return 'Month'
    case ReportDateFilter.Quarterly:
      return 'Quarter'
    case ReportDateFilter.Yearly:
      return 'Year'
  }
}

export const formatDateShortWithDateFilter = (date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return `W${formatDateInUtc(date, 'w yy').toUpperCase()}`
    case ReportDateFilter.Monthly:
      return formatDateInUtc(date, 'MMM yy').toUpperCase()
    case ReportDateFilter.Quarterly:
      return `Q${formatDateInUtc(date, 'Q yy').toUpperCase()}`
    case ReportDateFilter.Yearly:
      return formatDateInUtc(date, 'yyyy').toUpperCase()
  }
}

export const formatDateWithDateFilter = (date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return `${formatDateInUtc(date, 'MMM dd yyyy')} - ${formatDateInUtc(dateToUtc(endOfWeek(dateToLocal(date))), 'MMM dd yyyy')}`
    case ReportDateFilter.Monthly:
      return formatDateInUtc(date, 'MMMM yyyy')
    case ReportDateFilter.Quarterly:
      return `${formatDateInUtc(date, 'MMM yyyy')} - ${formatDateInUtc(dateToUtc(endOfQuarter(dateToLocal(date))), 'MMM yyyy')}`
    case ReportDateFilter.Yearly:
      return formatDateInUtc(date, 'yyyy')
  }
}

export const formatDateLongWithDateFilter = (date: Date, dateFilter: ReportDateFilter) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return `${formatDateInUtc(date, 'MMMM dd yyyy')} - ${formatDateInUtc(dateToUtc(endOfWeek(dateToLocal(date))), 'MMMM dd yyyy')}`
    case ReportDateFilter.Monthly:
      return formatDateInUtc(date, 'MMMM yyyy')
    case ReportDateFilter.Quarterly:
      return `${formatDateInUtc(date, 'MMMM yyyy')} - ${formatDateInUtc(dateToUtc(endOfQuarter(dateToLocal(date))), 'MMMM yyyy')}`
    case ReportDateFilter.Yearly:
      return formatDateInUtc(date, 'yyyy')
  }
}

export const filterTransactionsByDateFilter = (
  transactions: Transaction[],
  date: Date,
  dateFilter: ReportDateFilter
) => {
  switch (dateFilter) {
    case ReportDateFilter.Weekly:
      return transactions.filter(
        (t) =>
          t.date.getTime() >= date.getTime() && t.date.getTime() <= dateToUtc(endOfWeek(dateToLocal(date))).getTime()
      )
    case ReportDateFilter.Monthly:
      return transactions.filter(
        (t) =>
          t.date.getTime() >= date.getTime() && t.date.getTime() <= dateToUtc(endOfMonth(dateToLocal(date))).getTime()
      )
    case ReportDateFilter.Quarterly:
      return transactions.filter(
        (t) =>
          t.date.getTime() >= date.getTime() && t.date.getTime() <= dateToUtc(endOfQuarter(dateToLocal(date))).getTime()
      )
    case ReportDateFilter.Yearly:
      return transactions.filter((t) => t.date.getUTCFullYear() >= date.getUTCFullYear())
  }
}

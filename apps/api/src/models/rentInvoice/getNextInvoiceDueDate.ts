import { getDaysInMonth } from '../date/getDaysInMonth'

export const getNextInvoiceDueDate = (rentDueDayOfMonth: number, lastRentInvoiceDate: Date) => {
  const month = lastRentInvoiceDate.getMonth() + 1
  const year = lastRentInvoiceDate.getFullYear()
  const daysInMonth = getDaysInMonth(month, year)
  return new Date(year, month, rentDueDayOfMonth > daysInMonth ? daysInMonth : rentDueDayOfMonth)
}

export const getInvoiceDueDate = (rentDueDayOfMonth: number, date: Date) => {
  const month = date.getMonth()
  const year = date.getFullYear()
  const daysInMonth = getDaysInMonth(month, year)
  return new Date(year, month, rentDueDayOfMonth > daysInMonth ? daysInMonth : rentDueDayOfMonth)
}

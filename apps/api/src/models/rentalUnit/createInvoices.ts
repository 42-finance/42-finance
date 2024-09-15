import { Invoice } from 'database'
import { addMonths, getDaysInMonth, startOfDay } from 'date-fns'
import { InvoiceType } from 'shared-types'
import { EntityManager } from 'typeorm'

export const createInvoices = async (
  propertyId: number,
  rentalUnitId: number | null,
  expenseId: number | null,
  amount: number,
  type: InvoiceType,
  startDate: Date,
  entityManager: EntityManager
) => {
  const endDate = addMonths(startOfDay(new Date()), 1)
  const rentDueDayOfMonth = startDate.getDate()

  while (startDate <= endDate) {
    const month = startDate.getDate() > rentDueDayOfMonth ? startDate.getMonth() + 1 : startDate.getMonth()
    const year = startDate.getFullYear()
    const daysInMonth = getDaysInMonth(startDate)
    const date = new Date(year, month, rentDueDayOfMonth > daysInMonth ? daysInMonth : rentDueDayOfMonth)
    await entityManager.getRepository(Invoice).save({
      amount,
      type,
      date,
      propertyId,
      rentalUnitId,
      expenseId
    })
    startDate = addMonths(startDate, 1)
  }
}

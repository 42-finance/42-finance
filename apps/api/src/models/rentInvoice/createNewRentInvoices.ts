import { dataSource, Invoice, RentalUnit } from 'database'
import { addMonths } from 'date-fns'
import { getInvoiceDueDate, getNextInvoiceDueDate } from './getNextInvoiceDueDate'

export const createNewRentInvoices = async (rentalUnit: RentalUnit, entityManager = dataSource.manager) => {
  const lastRentInvoice = await dataSource
    .getRepository(Invoice)
    .createQueryBuilder('invoice')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = invoice.rentalUnitId')
    .where('rentalUnit.id = :id', { id: rentalUnit.id })
    .orderBy('invoice.dueDate', 'DESC')
    .getOne()

  const today = new Date()
  const newestRentInvoiceDate = getInvoiceDueDate(
    rentalUnit.rentDueDayOfMonth,
    rentalUnit.rentDueDayOfMonth < today.getDate() ? addMonths(today, 1) : today
  )
  let lastRentInvoiceDate = lastRentInvoice?.date ?? newestRentInvoiceDate

  const newInvoices: Invoice[] = []

  while (lastRentInvoiceDate.getTime() < newestRentInvoiceDate.getTime()) {
    const nextInvoiceDueDate = getNextInvoiceDueDate(rentalUnit.rentDueDayOfMonth, lastRentInvoiceDate)
    const newInvoice = await entityManager.getRepository(Invoice).save({
      amount: rentalUnit.rent,
      date: nextInvoiceDueDate,
      rentalUnitId: rentalUnit.id
    })
    newInvoices.push(newInvoice)
    lastRentInvoiceDate = nextInvoiceDueDate
  }

  return newInvoices.reverse()
}

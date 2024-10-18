import { Expense, Invoice, Property, RentalUnit, dataSource } from 'database'
import { addMonths } from 'date-fns'
import { Frequency, InvoiceType } from 'shared-types'

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getNextInvoiceDueDate = (rentDueDayOfMonth: number, lastRentInvoiceDate: Date) => {
  const month = lastRentInvoiceDate.getMonth() + 1
  const year = lastRentInvoiceDate.getFullYear()
  const daysInMonth = getDaysInMonth(month, year)
  return new Date(year, month, rentDueDayOfMonth > daysInMonth ? daysInMonth : rentDueDayOfMonth)
}

const getInvoiceDueDate = (rentDueDayOfMonth: number, date: Date) => {
  const month = date.getMonth()
  const year = date.getFullYear()
  const daysInMonth = getDaysInMonth(month, year)
  return new Date(year, month, rentDueDayOfMonth > daysInMonth ? daysInMonth : rentDueDayOfMonth)
}

export const handler = async () => {
  await dataSource.initialize()

  const today = new Date()

  const rentalUnits = await dataSource
    .createQueryBuilder()
    .select('rentalUnit')
    .from(RentalUnit, 'rentalUnit')
    .leftJoinAndMapOne('rentalUnit.property', Property, 'property', 'property.id = rentalUnit.propertyId')
    .addOrderBy('property.id')
    .addOrderBy('rentalUnit.id')
    .getMany()

  for (const rentalUnit of rentalUnits) {
    console.log(`${rentalUnit.property.id}: ${rentalUnit.property.address} - ${rentalUnit.id}: ${rentalUnit.name}`)

    const lastRentInvoice = await dataSource
      .getRepository(Invoice)
      .createQueryBuilder('invoice')
      .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = invoice.rentalUnitId')
      .where('rentalUnit.id = :id', { id: rentalUnit.id })
      .andWhere('type = :type', { type: InvoiceType.Rent })
      .orderBy('invoice.date', 'DESC')
      .getOne()

    console.log(`Last invoice date - ${lastRentInvoice?.date}`)

    const newestRentInvoiceDate = getInvoiceDueDate(
      rentalUnit.rentDueDayOfMonth,
      rentalUnit.rentDueDayOfMonth < today.getDate() ? addMonths(today, 1) : today
    )

    console.log(`Newest rent invoice date - ${newestRentInvoiceDate}`)

    let lastRentInvoiceDate = lastRentInvoice?.date ?? newestRentInvoiceDate

    const newInvoices: Invoice[] = []

    while (lastRentInvoiceDate.getTime() < newestRentInvoiceDate.getTime()) {
      const nextInvoiceDueDate = getNextInvoiceDueDate(rentalUnit.rentDueDayOfMonth, lastRentInvoiceDate)
      const newInvoice = await dataSource.getRepository(Invoice).save({
        amount: rentalUnit.rent,
        type: InvoiceType.Rent,
        date: nextInvoiceDueDate,
        rentalUnitId: rentalUnit.id,
        propertyId: rentalUnit.propertyId
      })
      newInvoices.push(newInvoice)
      lastRentInvoiceDate = nextInvoiceDueDate
    }

    console.log(`Created ${newInvoices.length} new invoices`)
  }

  const expenses = await dataSource
    .createQueryBuilder()
    .select('expense')
    .from(Expense, 'expense')
    .addOrderBy('expense.id')
    .getMany()

  for (const expense of expenses) {
    console.log(`${expense.id}: ${expense.name}`)

    const lastExpenseInvoice = await dataSource
      .getRepository(Invoice)
      .createQueryBuilder('invoice')
      .leftJoin(Expense, 'expense', 'expense.id = invoice.expenseId')
      .where('expense.id = :id', { id: expense.id })
      .andWhere('expense.frequency != :frequency', { frequency: Frequency.Once })
      .orderBy('invoice.date', 'DESC')
      .getOne()

    console.log(`Last invoice date - ${lastExpenseInvoice?.date}`)

    const newestRentInvoiceDate = getInvoiceDueDate(
      expense.dateOfFirstOccurence.getDate(),
      expense.dateOfFirstOccurence.getDate() < today.getDate() ? addMonths(today, 1) : today
    )

    console.log(`Newest rent invoice date - ${newestRentInvoiceDate}`)

    let lastRentInvoiceDate = lastExpenseInvoice?.date ?? newestRentInvoiceDate

    const newInvoices: Invoice[] = []

    while (lastRentInvoiceDate.getTime() < newestRentInvoiceDate.getTime()) {
      const nextInvoiceDueDate = getNextInvoiceDueDate(expense.dateOfFirstOccurence.getDate(), lastRentInvoiceDate)
      const newInvoice = await dataSource.getRepository(Invoice).save({
        amount: expense.amount,
        type: InvoiceType.Expense,
        date: nextInvoiceDueDate,
        rentalUnitId: expense.rentalUnitId,
        propertyId: expense.propertyId,
        expenseId: expense.id
      })
      newInvoices.push(newInvoice)
      lastRentInvoiceDate = nextInvoiceDueDate
    }

    console.log(`Created ${newInvoices.length} new invoices`)
  }

  console.log(`Invoices lambda complete`)
}

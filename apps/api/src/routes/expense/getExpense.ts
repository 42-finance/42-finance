import { dataSource, Expense, Invoice, Property, RentalUnit } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const expense = await dataSource
    .getRepository(Expense)
    .createQueryBuilder('expense')
    .leftJoinAndMapOne('expense.property', Property, 'property', 'property.id = expense.propertyId')
    .leftJoinAndMapOne('expense.rentalUnit', RentalUnit, 'rentalUnit', 'rentalUnit.id = expense.rentalUnitId')
    .leftJoinAndMapMany('expense.invoices', Invoice, 'invoice', 'invoice.expenseId = expense.id')
    .leftJoinAndMapOne('invoice.property', Property, 'invoiceProperty', 'invoiceProperty.id = invoice.propertyId')
    .leftJoinAndMapOne(
      'invoice.rentalUnit',
      RentalUnit,
      'invoiceRentalUnit',
      'invoiceRentalUnit.id = invoice.rentalUnitId'
    )
    .leftJoinAndMapOne('invoice.expense', Expense, 'invoiceExpense', 'invoiceExpense.id = invoice.expenseId')
    .where('expense.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .orderBy('invoice.date', 'DESC')
    .getOne()

  if (!expense) {
    return response.status(404).send({
      errors: [`Expense with id ${id} was not found`],
      payload: {}
    })
  }

  return response.send({
    errors: [],
    payload: expense
  })
}

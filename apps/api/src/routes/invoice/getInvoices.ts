import { dataSource, Expense, Invoice, Property, RentalUnit, Transaction } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{}, {}, {}>, response: Response<HTTPResponseBody>) => {
  const userId = request.userId

  const invoices = await dataSource
    .getRepository(Invoice)
    .createQueryBuilder('invoice')
    .leftJoinAndMapOne('invoice.rentalUnit', RentalUnit, 'rentalUnit', 'rentalUnit.id = invoice.rentalUnitId')
    .leftJoinAndMapOne('invoice.property', Property, 'property', 'property.id = invoice.propertyId')
    .leftJoinAndMapOne('invoice.expense', Expense, 'expense', 'expense.id = invoice.expenseId')
    .leftJoinAndMapOne('invoice.transaction', Transaction, 'transaction', 'transaction.id = invoice.transactionId')
    .where('property.landlordId = :userId', { userId })
    .andWhere('invoice.transactionId IS NULL')
    .addOrderBy('property.address', 'ASC')
    .addOrderBy('rentalUnit.name', 'ASC')
    .addOrderBy('expense.name', 'ASC')
    .addOrderBy('invoice.date', 'ASC')
    .getMany()

  return response.json({
    errors: [],
    payload: invoices
  })
}

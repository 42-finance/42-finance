import { dataSource, Expense, Invoice, Property, RentalUnit, Transaction } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const userId = request.userId
  const id = request.params.id

  try {
    const invoice = await dataSource
      .getRepository(Invoice)
      .createQueryBuilder('invoice')
      .leftJoinAndMapOne('invoice.rentalUnit', RentalUnit, 'rentalUnit', 'rentalUnit.id = invoice.rentalUnitId')
      .leftJoinAndMapOne('invoice.property', Property, 'property', 'property.id = invoice.propertyId')
      .leftJoinAndMapOne('invoice.expense', Expense, 'expense', 'expense.id = invoice.expenseId')
      .leftJoinAndMapOne('invoice.transaction', Transaction, 'transaction', 'transaction.id = invoice.transactionId')
      .where('property.landlordId = :userId', { userId })
      .andWhere('invoice.id = :id', { id })
      .getOneOrFail()

    return response.json({
      errors: [],
      payload: invoice
    })
  } catch (e) {
    return response.status(404).json({
      errors: [`Invoice with id ${id} not found`],
      payload: {}
    })
  }
}

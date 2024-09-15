import { dataSource, Expense, Property, RentalUnit } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const expenseRepo = dataSource.getRepository(Expense)
  const expense = await expenseRepo
    .createQueryBuilder('expense')
    .leftJoin(Property, 'property', 'property.id = expense.propertyId')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = expense.rentalUnitId')
    .leftJoin(Property, 'rentalUnitProperty', 'rentalUnitProperty.id = rentalUnit.propertyId')
    .where('expense.id = :id', { id })
    .andWhere('(property.landlordId = :userId OR rentalUnitProperty.landlordId = :userId)', { userId })
    .getOne()

  if (!expense) {
    return response.status(404).send({
      errors: [`Expense with id ${id} was not found`],
      payload: {}
    })
  }

  try {
    const result = await expenseRepo.remove(expense)
    return response.send({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).send({
      errors: [error.message],
      payload: {}
    })
  }
}

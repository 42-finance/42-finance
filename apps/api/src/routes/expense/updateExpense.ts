import { dataSource, Expense, Property } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'

export default async (request: Request, response: Response) => {
  const { id } = request.params
  const { name, description, amount } = request.body
  const userId = request.userId

  const expenseRepo = dataSource.getRepository(Expense)
  const expense = await expenseRepo
    .createQueryBuilder('expense')
    .leftJoin(Property, 'property', 'property.id = expense.propertyId')
    .where('expense.id = :id', { id })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()

  if (!expense) {
    return response.status(404).send(`Expense with id ${id} was not found`)
  }

  try {
    await expenseRepo.update(expense.id, { name, description, amount })
  } catch (error: any) {
    return response.status(500).send(error)
  }

  return response.send(_.assign(expense, { name, description, amount }))
}

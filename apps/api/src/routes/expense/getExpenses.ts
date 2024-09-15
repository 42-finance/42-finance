import { dataSource, Expense, Invoice, Property, RentalUnit } from 'database'
import { Request, Response } from 'express'
import { HTTPRequestQuery } from '../../models/http/httpRequestQuery'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { useQueryOptions } from '../../models/query/useQueryOptions'

export default async (request: Request<{}, {}, {}, HTTPRequestQuery>, response: Response<HTTPResponseBody>) => {
  const { userId, query } = request

  const { filters } = useQueryOptions(Expense, query)

  let expensesQuery = dataSource
    .getRepository(Expense)
    .createQueryBuilder('expense')
    .leftJoin(Property, 'property', 'property.id = expense.propertyId')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = expense.rentalUnitId')
    .leftJoin(Property, 'rentalUnitProperty', 'rentalUnitProperty.id = rentalUnit.propertyId')
    .leftJoinAndMapMany('expense.invoices', Invoice, 'invoice', 'invoice.expenseId = expense.id')
    .where('(property.landlordId = :userId OR rentalUnitProperty.landlordId = :userId)', { userId })

  if (filters['expense.propertyId']) {
    expensesQuery = expensesQuery.andWhere('expense.propertyId = :propertyId', {
      propertyId: filters['expense.propertyId']
    })
  } else if (filters['expense.rentalUnitId']) {
    expensesQuery = expensesQuery
      .leftJoin(RentalUnit, 'rentalUnit', 'expense.rentalUnitId = rentalUnit.id')
      .andWhere('expense.rentalUnitId = :rentalUnitId', { rentalUnitId: filters['expense.rentalUnitId'] })
  }

  const expenses = await expensesQuery.getMany()

  return response.json({
    errors: [],
    payload: expenses,
    metadata: {
      count: expenses.length
    }
  })
}

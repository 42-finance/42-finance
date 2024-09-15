import { Expense, Property, RentalUnit, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { Frequency, InvoiceType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { createInvoices } from '../../models/rentalUnit/createInvoices'

type CreateExpenseRequest = {
  name: string
  amount: number
  frequency: Frequency
  dateOfFirstOccurence: string
  propertyId: number
  rentalUnitId: number | null
}

export default async (request: Request<{}, {}, CreateExpenseRequest>, response: Response<HTTPResponseBody>) => {
  const { name, amount, frequency, dateOfFirstOccurence, propertyId, rentalUnitId = null } = request.body

  const userId = request.userId

  const property = await dataSource
    .getRepository(Property)
    .createQueryBuilder('property')
    .where('property.id = :propertyId', { propertyId })
    .andWhere('property.landlordId = :userId', { userId })
    .getOne()
  if (!property) {
    return response.status(404).json({
      errors: [`Property with id ${propertyId} was not found`],
      payload: {}
    })
  }

  let rentalUnit: RentalUnit | null = null

  if (rentalUnitId) {
    const rentalUnitRepository = dataSource.getRepository(RentalUnit)
    rentalUnit = await rentalUnitRepository
      .createQueryBuilder('rentalUnit')
      .where('rentalUnit.id = :rentalUnitId', { rentalUnitId })
      .leftJoin(Property, 'property', 'property.id = rentalUnit.propertyId')
      .andWhere('property.landlordId = :userId', { userId })
      .getOne()
    if (!rentalUnit) {
      return response.status(404).json({
        errors: [`Rental unit with id ${rentalUnitId} was not found`],
        payload: {}
      })
    }
  }

  const today = startOfDay(new Date())
  const startDateParsed = startOfDay(parseISO(dateOfFirstOccurence))
  if (startDateParsed.getTime() > today.getTime()) {
    return response.status(404).json({
      errors: [`Start date must be less than or equal to today`],
      payload: {}
    })
  }

  await dataSource.transaction(async (entityManager) => {
    try {
      const expense = await entityManager.getRepository(Expense).save({
        name,
        amount,
        frequency,
        dateOfFirstOccurence,
        propertyId,
        rentalUnitId
      })

      await createInvoices(
        propertyId,
        rentalUnitId,
        expense.id,
        amount,
        InvoiceType.Expense,
        startDateParsed,
        entityManager
      )

      return response.json({
        errors: [],
        payload: expense
      })
    } catch (error: any) {
      return response.status(500).json({
        errors: [error.message],
        payload: {}
      })
    }
  })
}

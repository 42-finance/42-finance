import { dataSource, Property, RentalUnit } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { InvoiceType, QueryError } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { createInvoices } from '../../models/rentalUnit/createInvoices'

type CreateRentalUnitRequest = {
  name: string
  rent: number
  firstRentDate: string
  propertyId: number
}

export default async (request: Request<{}, {}, CreateRentalUnitRequest>, response: Response<HTTPResponseBody>) => {
  const { name, rent, firstRentDate, propertyId } = request.body
  const userId = request.userId

  const property = await dataSource
    .getRepository(Property)
    .createQueryBuilder('property')
    .where('property.id = :propertyId', { propertyId })
    .andWhere('property.landlord.id = :userId', { userId })
    .getOne()

  if (!property) {
    return response.status(404).json({
      errors: [`A property with id ${propertyId} was not found`],
      payload: {}
    })
  }

  const today = startOfDay(new Date())
  const startDateParsed = startOfDay(parseISO(firstRentDate))
  const rentDueDayOfMonth = startDateParsed.getDate()

  if (startDateParsed.getTime() > today.getTime()) {
    return response.status(404).json({
      errors: [`Start date must be less than or equal to today`],
      payload: {}
    })
  }

  await dataSource.transaction(async (entityManager) => {
    let rentalUnit: RentalUnit

    try {
      rentalUnit = await entityManager.getRepository(RentalUnit).save({
        name,
        rent,
        rentDueDayOfMonth,
        propertyId: property.id
      })

      await createInvoices(
        property.id,
        rentalUnit.id,
        null,
        rentalUnit.rent,
        InvoiceType.Rent,
        startDateParsed,
        entityManager
      )
    } catch (error: any) {
      return error.code === QueryError.UniqueConstraintViolation
        ? response.status(409).json({
            errors: [`A rental unit with name ${name} already exists on this property`],
            payload: {}
          })
        : response.status(500).json({
            errors: [error.message],
            payload: {}
          })
    }

    return response.json({
      errors: [],
      payload: rentalUnit
    })
  })
}

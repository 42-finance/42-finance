import { dataSource, Invoice, Property, RentalUnit, Transaction } from 'database'
import { Request, Response } from 'express'
import { QueryError } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (
  request: Request<{ id: number }, {}, { transactionId: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { transactionId } = request.body
  const userId = request.userId

  const invoice = await dataSource
    .getRepository(Invoice)
    .createQueryBuilder('invoice')
    .leftJoinAndMapOne('invoice.rentalUnit', RentalUnit, 'rentalUnit', 'rentalUnit.id = invoice.rentalUnitId')
    .leftJoinAndMapOne('invoice.property', Property, 'property', 'property.id = invoice.propertyId')
    .where('property.landlordId = :userId', { userId })
    .andWhere('invoice.id = :id', { id })
    .getOne()

  if (!invoice) {
    return response.status(404).json({
      errors: [`Invoice with id ${id} not found`],
      payload: {}
    })
  }

  const transaction = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .where('transaction.id = :transactionId', { transactionId })
    .andWhere('transaction.userId = :userId', { userId })
    .getOne()
  if (!transaction) {
    return response.status(404).json({
      errors: [`Transaction with id ${transactionId} not found`],
      payload: {}
    })
  }

  dataSource.transaction(async (entityManager) => {
    let updatedInvoice: Invoice
    try {
      updatedInvoice = await entityManager.getRepository(Invoice).save({
        id: invoice.id,
        transactionId: transaction.id
      })
    } catch (error: any) {
      return error.code === QueryError.UniqueConstraintViolation
        ? response.status(409).json({
            errors: [`Transaction with id ${transactionId} is already linked to an invoice`],
            payload: {}
          })
        : response.status(500).json({
            errors: [error.message],
            payload: {}
          })
    }

    return response.json({
      errors: [],
      payload: updatedInvoice
    })
  })
}

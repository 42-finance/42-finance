import { dataSource, Invoice, RentalUnit, Tenant, Transaction } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const userId = request.userId

  const invoice = await dataSource
    .getRepository(Invoice)
    .createQueryBuilder('invoice')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = invoice.rentalUnitId')
    .leftJoin(Tenant, 'tenant', 'tenant.rentalUnitId = rentalUnit.id')
    .leftJoinAndMapOne(
      'rentInvoice.transaction',
      Transaction,
      'transaction',
      'transaction.id = rentInvoice.transactionId'
    )
    .where('tenant.id = :id', { id })
    .andWhere('tenant.userId = :userId', { userId })
    .addOrderBy('rentInvoice.dueDate', 'DESC')
    .getOne()

  if (!invoice) {
    return response.status(404).json({
      errors: [`Unable to retrieve invoice for tenant with id ${id}`],
      payload: {}
    })
  }

  return response.json({
    errors: [],
    payload: invoice
  })
}

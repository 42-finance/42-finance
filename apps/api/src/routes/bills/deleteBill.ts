import { Bill, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteBill = async (request: Request<{ id: number }, {}, {}>, response: Response<HTTPResponseBody>) => {
  const { id } = request.params
  const { householdId } = request

  const bill = await dataSource
    .getRepository(Bill)
    .createQueryBuilder('bill')
    .where('bill.id = :id', { id })
    .andWhere('bill.householdId = :householdId', { householdId })
    .getOneOrFail()

  const result = await dataSource.getRepository(Bill).remove(bill)

  return response.send({
    errors: [],
    payload: result
  })
}

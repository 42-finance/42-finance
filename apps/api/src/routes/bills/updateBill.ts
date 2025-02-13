import { Account, Bill, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateBillRequest = {
  balance?: number | null
  issueDate?: Date
  dueDate?: Date | null
  minimumPaymentAmount?: number | null
  accountId?: string
}

export const updateBill = async (
  request: Request<{ id: string }, object, UpdateBillRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { balance, issueDate, dueDate, minimumPaymentAmount, accountId } = request.body

  const bill = await dataSource
    .getRepository(Bill)
    .createQueryBuilder('bill')
    .where('bill.id = :id', { id })
    .andWhere('bill.householdId = :householdId', { householdId })
    .getOneOrFail()

  await dataSource.getRepository(Account).findOneByOrFail({
    id: accountId,
    householdId
  })

  const result = await dataSource.getRepository(Bill).save({
    id: bill.id,
    balance,
    issueDate,
    dueDate,
    minimumPaymentAmount,
    accountId
  })

  return response.json({
    errors: [],
    payload: result
  })
}

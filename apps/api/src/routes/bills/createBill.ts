import { Account, Bill, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateBillRequest = {
  balance: number | null
  issueDate: Date
  dueDate: Date | null
  minimumPaymentAmount: number | null
  accountId: string
}

export const createBill = async (
  request: Request<{ id: string }, object, CreateBillRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { balance, issueDate, dueDate, minimumPaymentAmount, accountId } = request.body

  await dataSource.getRepository(Account).findOneByOrFail({
    id: accountId,
    householdId
  })

  const bill = await dataSource.getRepository(Bill).save({
    balance,
    issueDate,
    dueDate,
    minimumPaymentAmount,
    accountId,
    householdId
  })

  return response.json({
    errors: [],
    payload: bill
  })
}

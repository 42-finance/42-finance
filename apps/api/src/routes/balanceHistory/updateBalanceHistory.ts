import { Account, BalanceHistory, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateBalanceHistoryRequest = {
  date: string
  currentBalance: number
}

export default async (
  request: Request<{ accountId: string }, object, UpdateBalanceHistoryRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { accountId } = request.params
  const { date, currentBalance } = request.body

  const account = await dataSource.getRepository(Account).findOneByOrFail({ id: accountId, householdId })

  const parsedDate = startOfDay(parseISO(date))

  const result = await dataSource
    .getRepository(BalanceHistory)
    .createQueryBuilder()
    .insert()
    .values({
      accountId: account.id,
      date: parsedDate,
      currentBalance,
      householdId
    })
    .orUpdate(['currentBalance'], ['date', 'accountId'])
    .execute()

  return response.send({
    errors: [],
    payload: result
  })
}

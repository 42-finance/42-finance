import { BalanceHistory, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type DeleteBalanceHistoryRequest = {
  date: string
  currentBalance: number
}

export default async (
  request: Request<{ accountId: string }, object, DeleteBalanceHistoryRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { accountId } = request.params
  const { date } = request.body

  const parsedDate = startOfDay(parseISO(date))

  const result = await dataSource
    .getRepository(BalanceHistory)
    .createQueryBuilder()
    .delete()
    .where('accountId = :accountId', { accountId })
    .andWhere('date = :date', { date: parsedDate })
    .andWhere('householdId = :householdId', { householdId })
    .execute()

  return response.send({
    errors: [],
    payload: result
  })
}

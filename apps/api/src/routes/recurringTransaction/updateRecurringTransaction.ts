import { RecurringTransaction, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { CategoryType, Frequency } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateRecurringTransactionRequest = {
  name?: string
  startDate?: string
  frequency?: Frequency
  amount?: number
  type?: CategoryType
  accountId?: string
  merchantId?: number
}

export const updateRecurringTransaction = async (
  request: Request<{ id: string }, object, UpdateRecurringTransactionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name, startDate, frequency, amount, type, accountId, merchantId } = request.body

  const transaction = await dataSource
    .getRepository(RecurringTransaction)
    .createQueryBuilder('recurringTransaction')
    .where('recurringTransaction.id = :id', { id })
    .andWhere('recurringTransaction.householdId = :householdId', { householdId })
    .getOneOrFail()

  let parsedDate: Date | undefined

  if (startDate) {
    parsedDate = startOfDay(parseISO(startDate))
  }

  const result = await dataSource.getRepository(RecurringTransaction).save({
    id: transaction.id,
    name,
    startDate: parsedDate,
    frequency,
    amount,
    type,
    accountId,
    merchantId
  })

  return response.json({
    errors: [],
    payload: result
  })
}

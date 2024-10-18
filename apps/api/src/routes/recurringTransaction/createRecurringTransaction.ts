import { Boom } from '@hapi/boom'
import { Account, Merchant, RecurringTransaction, Transaction, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { CategoryType, Frequency } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateRecurringTransactionRequest = {
  name: string
  startDate: string
  frequency: Frequency
  interval: number | null
  amount: number
  type: CategoryType
  accountId: string
  merchantId: number
  transactionIds?: string[]
}

export const createRecurringTransaction = async (
  request: Request<object, object, CreateRecurringTransactionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { name, startDate, frequency, interval, amount, type, accountId, merchantId, transactionIds } = request.body

  const parsedDate = startOfDay(parseISO(startDate))
  const merchant = await dataSource.getRepository(Merchant).findOneOrFail({ where: { id: merchantId, householdId } })
  const account = await dataSource.getRepository(Account).findOneOrFail({ where: { id: accountId, householdId } })

  let transactions: Transaction[] | undefined = undefined

  if (transactionIds) {
    if (transactionIds.length) {
      transactions = await dataSource
        .getRepository(Transaction)
        .createQueryBuilder('transaction')
        .andWhere('transaction.householdId = :householdId', { householdId })
        .andWhere('transaction.id IN (:...transactionIds)', { transactionIds })
        .getMany()

      if (transactions.length !== transactionIds.length) {
        throw new Boom('Invalid transactions', { statusCode: 409 })
      }
    } else {
      transactions = []
    }
  }

  const result = await dataSource.getRepository(RecurringTransaction).save({
    name,
    startDate: parsedDate,
    frequency,
    interval,
    amount,
    type,
    status: true,
    accountId: account.id,
    merchantId: merchant.id,
    transactions,
    householdId
  })

  return response.json({
    errors: [],
    payload: result
  })
}

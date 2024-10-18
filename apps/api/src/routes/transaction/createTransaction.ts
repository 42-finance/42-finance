import { randomUUID } from 'crypto'
import { Account, Category, Transaction, dataSource, getOrCreateMerchant } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { CurrencyCode, TransactionType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateTransactionRequest = {
  date: string
  amount: number
  accountId: string
  categoryId: number
  merchantName: string
  currencyCode: CurrencyCode
}

export const createTransaction = async (
  request: Request<object, object, CreateTransactionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { date, amount, accountId, categoryId, merchantName, currencyCode = CurrencyCode.USD } = request.body

  const parsedDate = startOfDay(parseISO(date))
  const merchant = await getOrCreateMerchant(merchantName, merchantName, null, householdId)
  const account = await dataSource.getRepository(Account).findOneOrFail({ where: { id: accountId, householdId } })
  const category = await dataSource.getRepository(Category).findOneOrFail({ where: { id: categoryId, householdId } })

  const result = await dataSource.getRepository(Transaction).save({
    id: randomUUID(),
    name: merchant.name,
    date: parsedDate,
    amount,
    currencyCode,
    pending: false,
    type: TransactionType.Manual,
    needsReview: false,
    hidden: false,
    accountId: account.id,
    categoryId: category.id,
    merchantId: merchant.id,
    householdId
  })

  return response.json({
    errors: [],
    payload: result
  })
}

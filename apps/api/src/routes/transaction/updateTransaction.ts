import { Boom } from '@hapi/boom'
import { Category, RecurringTransaction, Tag, Transaction, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { CurrencyCode } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateTransactionRequest = {
  date?: string
  categoryId?: number
  hidden?: boolean
  needsReview?: boolean
  currencyCode?: CurrencyCode
  notes?: string
  tagIds?: number[]
  recurringTransactionId?: number | null
}

export const updateTransaction = async (
  request: Request<{ id: string }, object, UpdateTransactionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { date, categoryId, hidden, needsReview, currencyCode, notes, tagIds, recurringTransactionId } = request.body

  const transaction = await dataSource
    .getRepository(Transaction)
    .createQueryBuilder('transaction')
    .where('transaction.id = :id', { id })
    .andWhere('transaction.householdId = :householdId', { householdId })
    .getOneOrFail()

  let parsedDate: Date | undefined

  if (date) {
    parsedDate = startOfDay(parseISO(date))
  }

  if (categoryId != null) {
    await dataSource.getRepository(Category).findOneByOrFail({ id: categoryId, householdId })
  }

  let tags: Tag[] | undefined = undefined

  if (tagIds) {
    if (tagIds.length) {
      tags = await dataSource
        .getRepository(Tag)
        .createQueryBuilder('tag')
        .andWhere('tag.householdId = :householdId', { householdId })
        .andWhere('tag.id IN (:...tagIds)', { tagIds })
        .getMany()

      if (tags.length !== tagIds.length) {
        throw new Boom('Invalid tags', { statusCode: 409 })
      }
    } else {
      tags = []
    }
  }

  if (recurringTransactionId != null) {
    await dataSource.getRepository(RecurringTransaction).findOneByOrFail({ id: recurringTransactionId, householdId })
  }

  const result = await dataSource.getRepository(Transaction).save({
    id: transaction.id,
    date: parsedDate,
    categoryId,
    hidden,
    needsReview,
    currencyCode,
    notes,
    tags: tags ? tags.map((t) => ({ id: t.id })) : undefined,
    recurringTransactionId
  })

  return response.json({
    errors: [],
    payload: result
  })
}

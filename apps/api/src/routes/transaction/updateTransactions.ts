import { Boom } from '@hapi/boom'
import { Category, Merchant, RecurringTransaction, Tag, Transaction, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateTransactionsRequest = {
  transactionIds: string[]
  date?: string
  hidden?: boolean
  needsReview?: boolean
  categoryId?: number
  merchantId?: number
  tagIds?: number[]
  recurringTransactionId: number
}

export default async (
  request: Request<object, object, UpdateTransactionsRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { transactionIds, date, hidden, needsReview, categoryId, merchantId, tagIds, recurringTransactionId } =
    request.body

  if (transactionIds.length) {
    const transactionCount = await dataSource
      .getRepository(Transaction)
      .createQueryBuilder('transaction')
      .where('transaction.id IN (:...transactionIds)', { transactionIds })
      .andWhere('transaction.householdId = :householdId', { householdId })
      .getCount()

    if (transactionCount !== transactionIds.length) {
      return response.status(404).send({
        errors: [`Invalid transaction ids`],
        payload: {}
      })
    }
  }

  if (categoryId) {
    const category = await dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('category.householdId = :householdId', { householdId })
      .getOne()

    if (!category) {
      throw new Boom('Invalid category', { statusCode: 409 })
    }
  }

  if (merchantId) {
    const merchant = await dataSource
      .getRepository(Merchant)
      .createQueryBuilder('merchant')
      .where('merchant.id = :merchantId', { merchantId })
      .andWhere('merchant.householdId = :householdId', { householdId })
      .getOne()

    if (!merchant) {
      throw new Boom('Invalid merchant', { statusCode: 409 })
    }
  }

  if (recurringTransactionId) {
    const recurringTransaction = await dataSource
      .getRepository(RecurringTransaction)
      .createQueryBuilder('recurringTransaction')
      .where('recurringTransaction.id = :recurringTransactionId', { recurringTransactionId })
      .andWhere('recurringTransaction.householdId = :householdId', { householdId })
      .getOne()

    if (!recurringTransaction) {
      throw new Boom('Invalid recurring transaction', { statusCode: 409 })
    }
  }

  if (tagIds?.length) {
    const tags = await dataSource
      .getRepository(Tag)
      .createQueryBuilder('tag')
      .andWhere('tag.householdId = :householdId', { householdId })
      .andWhere('tag.id IN (:...tagIds)', { tagIds })
      .getMany()

    if (tags.length !== tagIds.length) {
      throw new Boom('Invalid tags', { statusCode: 409 })
    }
  }

  const parsedDate = date ? startOfDay(parseISO(date)) : undefined

  let result

  if (transactionIds.length) {
    await dataSource.transaction(async (entityManager) => {
      result = await entityManager.getRepository(Transaction).update(transactionIds, {
        date: parsedDate,
        hidden,
        needsReview,
        categoryId,
        merchantId,
        recurringTransactionId
      })

      if (tagIds?.length) {
        await entityManager
          .createQueryBuilder()
          .insert()
          .into('transaction_tag')
          .values(transactionIds.flatMap((transactionId) => tagIds.map((tagId) => ({ transactionId, tagId }))))
          .orIgnore()
          .execute()
      }
    })
  } else {
    result = await dataSource
      .createQueryBuilder()
      .update(Transaction)
      .set({
        date: parsedDate,
        hidden,
        needsReview,
        categoryId,
        merchantId
      })
      .where({ householdId })
      .execute()
  }

  return response.send({
    errors: [],
    payload: result
  })
}

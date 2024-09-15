import { dataSource, Transaction } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type SplitTransaction = {
  id: string
  amount: number
  categoryId: number
}

type SplitTransactionRequest = {
  splitTransactions: SplitTransaction[]
}

export const splitTransaction = async (
  request: Request<{ id: string }, object, SplitTransactionRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { splitTransactions } = request.body

  try {
    const transaction = await dataSource
      .getRepository(Transaction)
      .createQueryBuilder('transaction')
      .where('transaction.id = :id', { id })
      .andWhere('transaction.householdId = :householdId', { householdId })
      .getOne()
    if (!transaction) {
      return response.status(404).json({
        errors: [`Transaction with id ${id} not found`],
        payload: {}
      })
    }

    const newTransactions: Transaction[] = []

    await dataSource.transaction(async (entityManager) => {
      for (const splitTransaction of splitTransactions) {
        const newTransaction = await entityManager.getRepository(Transaction).save({
          id: splitTransaction.id,
          name: transaction.name,
          date: transaction.date,
          amount: splitTransaction.amount,
          currencyCode: transaction.currencyCode,
          pending: transaction.pending,
          type: transaction.type,
          needsReview: transaction.needsReview,
          hidden: false,
          accountId: transaction.accountId,
          categoryId: splitTransaction.categoryId,
          merchantId: transaction.merchantId,
          splitTransactionId: transaction.id,
          householdId
        })

        newTransactions.push(newTransaction)
      }

      return await entityManager.getRepository(Transaction).update(transaction.id, {
        split: true
      })
    })

    return response.json({
      errors: [],
      payload: newTransactions
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

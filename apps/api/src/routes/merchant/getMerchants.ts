import { Merchant, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type MerchantsQueryParams = {
  search?: string | null
}

export const getMerchants = async (
  request: Request<{}, {}, {}, MerchantsQueryParams>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { search } = request.query

  try {
    let merchantsQuery = dataSource
      .getRepository(Merchant)
      .createQueryBuilder('merchant')
      .loadRelationCountAndMap('merchant.transactionCount', 'merchant.transactions')
      .addSelect('COUNT(transaction.id) as transactioncount')
      .leftJoin('merchant.transactions', 'transaction')
      .where('merchant.householdId = :householdId', { householdId })
      .groupBy('merchant.id')
      .addOrderBy('transactioncount', 'DESC')
      .addOrderBy('merchant.name')
      .addOrderBy('merchant.id')

    if (search) {
      merchantsQuery = merchantsQuery.andWhere(`merchant.name ILIKE :search`, { search: `%${search}%` })
    }

    const merchants = await merchantsQuery.getMany()

    return response.send({
      errors: [],
      payload: merchants
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

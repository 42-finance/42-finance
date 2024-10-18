import { Merchant, dataSource } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateMerchantRequest = {
  name?: string
}

export const updateMerchant = async (
  request: Request<{ id: string }, {}, UpdateMerchantRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name } = request.body

  const merchant = await dataSource
    .getRepository(Merchant)
    .createQueryBuilder('merchant')
    .where('merchant.id = :id', { id })
    .andWhere('merchant.householdId = :householdId', { householdId })
    .getOne()

  if (!merchant) {
    return response.status(404).json({
      errors: [`Merchant with id ${id} not found`],
      payload: {}
    })
  }

  try {
    const result = await dataSource.getRepository(Merchant).update(merchant.id, {
      name
    })
    return response.json({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

import { Merchant, dataSource } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const getMerchant = async (
  request: Request<{ id: string }, {}, {}, {}>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params

  try {
    const merchant = await dataSource
      .getRepository(Merchant)
      .createQueryBuilder('merchant')
      .where('merchant.householdId = :householdId', { householdId })
      .andWhere('merchant.id = :id', { id })
      .getOneOrFail()

    return response.send({
      errors: [],
      payload: merchant
    })
  } catch (error: any) {
    return response.status(500).json({
      errors: [error.message],
      payload: {}
    })
  }
}

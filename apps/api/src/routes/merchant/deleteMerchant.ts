import { Merchant, dataSource } from 'database'
import { Request, Response } from 'express'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteMerchant = async (
  request: Request<{ id: number }, {}, {}>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const { householdId } = request

  const merchant = await dataSource
    .getRepository(Merchant)
    .createQueryBuilder('merchant')
    .where('merchant.id = :id', { id })
    .andWhere('merchant.householdId = :householdId', { householdId })
    .getOne()

  if (!merchant) {
    return response.status(404).send({
      errors: [`Merchant with id ${id} was not found`],
      payload: {}
    })
  }

  try {
    const result = await dataSource.getRepository(Merchant).softRemove(merchant)
    return response.send({
      errors: [],
      payload: result
    })
  } catch (error: any) {
    return response.status(500).send({
      errors: [error.message],
      payload: {}
    })
  }
}

import { Account, BalanceHistory, Transaction, dataSource } from 'database'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export const deleteAccount = async (request: Request<{ id: string }>, response: Response<HTTPResponseBody>) => {
  const { householdId } = request
  const { id } = request.params

  const account = await dataSource
    .getRepository(Account)
    .createQueryBuilder('account')
    .where('account.id = :id', { id })
    .andWhere('account.householdId = :householdId', { householdId })
    .getOneOrFail()

  await dataSource.transaction(async (entityManager) => {
    await entityManager
      .getRepository(Transaction)
      .createQueryBuilder()
      .delete()
      .where('accountId = :accountId', { accountId: id })
      .execute()

    await entityManager
      .getRepository(BalanceHistory)
      .createQueryBuilder()
      .delete()
      .where('accountId = :accountId', { accountId: id })
      .execute()

    const result = await entityManager.getRepository(Account).softDelete(account.id)

    return response.json({
      errors: [],
      payload: result
    })
  })
}

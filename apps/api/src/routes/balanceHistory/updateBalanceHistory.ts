import { Account, BalanceHistory, dataSource } from 'database'
import { parseISO, startOfDay } from 'date-fns'
import { Request, Response } from 'express'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateBalanceHistoryEntry = {
  date: string
  currentBalance: number
  availableBalance?: number
  limit?: number
  walletTokenBalance?: number
}

type UpdateBalanceHistoryRequest = {
  accountId: string
  history: UpdateBalanceHistoryEntry[]
}

export default async (
  request: Request<object, object, UpdateBalanceHistoryRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { accountId, history } = request.body

  const account = await dataSource.getRepository(Account).findOneByOrFail({ id: accountId })

  await dataSource.transaction(async (entityManager) => {
    for (const historyEntry of history) {
      const parsedDate = startOfDay(parseISO(historyEntry.date))
      await entityManager
        .getRepository(BalanceHistory)
        .createQueryBuilder()
        .insert()
        .values({
          accountId: account.id,
          date: parsedDate,
          currentBalance: historyEntry.currentBalance,
          availableBalance: historyEntry.availableBalance,
          limit: historyEntry.limit,
          walletTokenBalance: historyEntry.walletTokenBalance,
          householdId
        })
        .orUpdate(['currentBalance', 'availableBalance', 'limit', 'walletTokenBalance'], ['date', 'accountId'])
        .execute()
    }
  })

  return response.send({
    errors: [],
    payload: {}
  })
}

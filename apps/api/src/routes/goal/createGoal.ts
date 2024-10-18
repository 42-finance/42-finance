import { Boom } from '@hapi/boom'
import { Account, Goal, dataSource } from 'database'
import { Request, Response } from 'express'
import { GoalType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type CreateGoalRequest = {
  name: string
  amount: number
  accountIds: string[]
  type: GoalType
  startDate: Date | null
  targetDate: Date | null
  budgetAmount: number | null
}

export const createGoal = async (
  request: Request<{ id: string }, object, CreateGoalRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { name, amount, accountIds, type, startDate, targetDate, budgetAmount } = request.body

  let accounts: Account[] = []

  if (accountIds.length) {
    accounts = await dataSource
      .getRepository(Account)
      .createQueryBuilder('account')
      .andWhere('account.householdId = :householdId', { householdId })
      .andWhere('account.id IN (:...accountIds)', { accountIds })
      .getMany()

    if (accounts.length !== accountIds.length) {
      throw new Boom('Invalid accounts', { statusCode: 409 })
    }
  }

  const goal = await dataSource.getRepository(Goal).save({
    name,
    amount,
    type,
    startDate,
    targetDate,
    budgetAmount,
    accounts: accounts ? accounts.map((a) => ({ id: a.id })) : undefined,
    householdId
  })

  return response.json({
    errors: [],
    payload: goal
  })
}

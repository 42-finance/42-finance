import { Boom } from '@hapi/boom'
import { Account, Goal, dataSource } from 'database'
import { Request, Response } from 'express'
import { GoalType } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'

type UpdateGoalRequest = {
  name?: string
  amount?: number
  accountIds?: string[]
  type?: GoalType
  targetDate?: Date | null
  budgetAmount?: number | null
}

export const updateGoal = async (
  request: Request<{ id: string }, object, UpdateGoalRequest>,
  response: Response<HTTPResponseBody>
) => {
  const { householdId } = request
  const { id } = request.params
  const { name, amount, accountIds, type, targetDate, budgetAmount } = request.body

  const goal = await dataSource
    .getRepository(Goal)
    .createQueryBuilder('goal')
    .where('goal.id = :id', { id })
    .andWhere('goal.householdId = :householdId', { householdId })
    .getOneOrFail()

  let accounts: Account[] | undefined = undefined

  if (accountIds) {
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
    } else {
      accounts = []
    }
  }

  const result = await dataSource.getRepository(Goal).save({
    id: goal.id,
    name,
    amount,
    type,
    targetDate,
    budgetAmount,
    accounts: accounts ? accounts.map((a) => ({ id: a.id })) : undefined
  })

  return response.json({
    errors: [],
    payload: result
  })
}

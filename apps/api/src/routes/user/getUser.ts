import { Account, Budget, Category, User, UserInvite, dataSource } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { AccountSetup } from 'shared-types'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { getStripeSubscription } from '../../utils/stripe.utils'

export default async (request: Request<{ id: number }>, response: Response<HTTPResponseBody>) => {
  const { householdId, userId } = request

  const user = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :userId', { userId })
    .getOne()

  if (!user || user.id !== request.userId) {
    response.status(404).json({
      errors: [`A user with id: ${userId} was not found`],
      payload: {}
    })
    return
  }

  const invitations = await dataSource
    .getRepository(UserInvite)
    .find({ where: { email: user.email }, relations: ['invitedByUser'] })

  let accountSetup: AccountSetup | null = null

  if (householdId) {
    const accountCount = await dataSource
      .getRepository(Account)
      .createQueryBuilder('account')
      .where('account.householdId = :householdId', { householdId })
      .getCount()

    const categoryCount = await dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .where('category.householdId = :householdId', { householdId })
      .andWhere('category.systemCategory IS NULL')
      .getCount()

    const budgetCount = await dataSource
      .getRepository(Budget)
      .createQueryBuilder('budget')
      .where('budget.householdId = :householdId', { householdId })
      .getCount()

    const { subscriptionType } = await getStripeSubscription(householdId)

    accountSetup = {
      subscription: subscriptionType != null,
      accounts: accountCount > 0,
      categories: categoryCount > 0,
      budget: budgetCount > 0,
      currency: user.profileUpdated
    }
  }

  const payload = {
    ..._.omit(user, ['passwordHash']),
    invitations,
    accountSetup,
    hasPassword: user.passwordHash != null
  }

  return response.json({
    errors: [],
    payload
  })
}

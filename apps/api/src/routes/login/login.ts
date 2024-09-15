import bcrypt from 'bcryptjs'
import { Household, HouseholdUser, Property, Tenant, User, dataSource } from 'database'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import { sendEmailConfirmation } from '../../services/emailConfirmation/emailConfirmationService'

export const login = async (
  request: Request<object, object, { email: string; password: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { email, password } = request.body

  const userRepository = dataSource.getRepository(User)

  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndMapMany('user.properties', Property, 'property', 'property.landlordId = user.id')
    .leftJoinAndMapMany('user.tenants', Tenant, 'tenant', 'tenant.userId = user.id')
    .where('LOWER(user.email) = :email', { email: email.toLowerCase() })
    .getOne()

  if (!user || !user.passwordHash) {
    response.status(403).json({
      errors: ['Email or password is incorrect'],
      payload: {}
    })
    return
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    return response.status(403).json({
      errors: ['Email or password is incorrect'],
      payload: {}
    })
  }

  if (!user.emailConfirmed) {
    await sendEmailConfirmation(user.id, user.email, user.passwordHash)
    return response.status(423).json({
      errors: ['You must confirm your email before you can login. A new confirmation email has been sent'],
      payload: {}
    })
  }

  const households = await dataSource
    .getRepository(Household)
    .createQueryBuilder('household')
    .leftJoin(HouseholdUser, 'householdUser', 'householdUser.householdId = household.id')
    .where('householdUser.userId = :userId', { userId: user.id })
    .getMany()

  const token = jwt.sign(
    { userId: user.id, householdId: households.length > 0 ? households[0].id : undefined },
    process.env.TOKEN_SECRET as string
  )

  return response.json({
    errors: [],
    payload: {
      token,
      user: _.omit(user, ['passwordHash']),
      invitations: [],
      currencyCode: user.currencyCode
    }
  })
}

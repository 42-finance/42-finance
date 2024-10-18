import { dataSource, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import _ from 'lodash'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'
import validateFields from '../helpers/validateFields'

export default async (
  request: Request<
    {},
    {},
    {
      email: string
      name: string
      rentalUnitId: number
      sendInviteEmail: boolean
    }
  >,
  response: Response<HTTPResponseBody>
) => {
  const { email, name, rentalUnitId, sendInviteEmail } = request.body
  const userId = request.userId

  const validationErrors = validateFields(
    {
      required: ['email', 'name', 'rentalUnitId']
    },
    request.body
  )
  if (!_.isEmpty(validationErrors)) {
    return response.status(400).json({
      errors: validationErrors,
      payload: {}
    })
  }

  const rentalUnitRepository = dataSource.getRepository(RentalUnit)
  const rentalUnit = await rentalUnitRepository
    .createQueryBuilder('rentalUnit')
    .leftJoin('property', 'property', 'property.id = rentalUnit.propertyId')
    .where('rentalUnit.id = :rentalUnitId', { rentalUnitId })
    .andWhere('property.landlord.id = :userId', { userId })
    .getOne()
  if (!rentalUnit) {
    return response.status(404).json({
      errors: [`A tenant group with id ${rentalUnitId} was not found`],
      payload: {}
    })
  }

  const existingTenant = await dataSource
    .getRepository(Tenant)
    .createQueryBuilder('tenant')
    .leftJoin('user', 'user', 'user.id = tenant.userId')
    .where('user.email = :email', { email })
    .andWhere('tenant.rentalUnit.id = :rentalUnitId', { rentalUnitId })
    .getOne()
  if (existingTenant) {
    return response.status(409).json({
      errors: [`A tenant with email ${email} already exists on rental unit with id ${rentalUnitId}`],
      payload: {}
    })
  }

  const userRepository = dataSource.getRepository(User)
  let user = await userRepository.createQueryBuilder('user').where('user.email = :email', { email }).getOne()

  await dataSource.transaction(async (entityManager) => {
    if (!user) {
      user = await entityManager
        .getRepository(User)
        .save({ email: email, name: name, passwordHash: '', emailConfirmed: false })
    }

    const tenant = await entityManager.getRepository(Tenant).save({
      userId: user.id,
      rentalUnitId: rentalUnit.id
    })

    // if (sendInviteEmail) {
    //   await sendEmail(user.email, 'Renty - Invitation', EmailType.Invitation, {})
    // }

    return response.json({
      errors: [],
      payload: tenant
    })
  })
}

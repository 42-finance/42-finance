import { dataSource, Property, RentalUnit, Tenant, User } from 'database'
import { Request, Response } from 'express'
import { InvitationState, QueryError } from 'shared-types'
import { HTTPResponseBody } from '../../models/http/httpResponseBody'

export default async (
  request: Request<{ id: number }, {}, Partial<Tenant> & { name: string; email: string }>,
  response: Response<HTTPResponseBody>
) => {
  const { id } = request.params
  const userId = request.userId

  const tenant = await dataSource
    .getRepository(Tenant)
    .createQueryBuilder('tenant')
    .leftJoinAndMapOne('tenant.user', User, 'user', 'user.id = tenant.userId')
    .leftJoin(RentalUnit, 'rentalUnit', 'rentalUnit.id = tenant.rentalUnitId')
    .leftJoin(Property, 'property', 'property.id = rentalUnit.propertyId')
    .where('tenant.id = :id', { id })
    .andWhere('(tenant.userId = :userId OR property.landlordId = :userId)', { userId })
    .getOne()

  if (!tenant) {
    return response.status(404).json({
      errors: [`Tenant with id: ${id} was not found`],
      payload: {}
    })
  }

  const isTenant = tenant.userId === userId
  let updatePayload: {}
  if (isTenant) {
    updatePayload = {
      invitationState: request.body.invitationState
    }
  }

  await dataSource.transaction(async (entityManager) => {
    if (tenant.invitationState !== InvitationState.Accepted) {
      const { email = tenant.user.email, name } = request.body

      if (tenant.user.email === email && !tenant.user.emailConfirmed) {
        try {
          await entityManager.getRepository(User).save({
            id: tenant.user.id,
            name
          })
        } catch (error: any) {
          return response.status(500).json({
            errors: [error.message],
            payload: {}
          })
        }
      } else if (tenant.user.email !== email) {
        let user = await dataSource
          .getRepository(User)
          .createQueryBuilder('user')
          .where('user.email = :email', { email: request.body.email })
          .getOne()
        if (user) {
          if (!user.emailConfirmed) {
            try {
              await entityManager.getRepository(User).save({
                id: user.id,
                name
              })
            } catch (error: any) {
              return response.status(500).json({
                errors: [error.message],
                payload: {}
              })
            }
          }
        } else {
          user = await entityManager
            .getRepository(User)
            .save({ email: email, name: name, passwordHash: '', emailConfirmed: false })
        }
        updatePayload = {
          ...updatePayload,
          userId: user.id,
          invitationState: InvitationState.Pending
        }
      }
    }

    let updatedTenant: Tenant
    try {
      updatedTenant = await entityManager.getRepository(Tenant).save({
        id: tenant.id,
        ...updatePayload
      })
    } catch (error: any) {
      return error.code === QueryError.UniqueConstraintViolation
        ? response.status(409).json({
            errors: [`Tenant with email ${request.body.email} already exists on this rental unit`],
            payload: {}
          })
        : response.status(500).json({
            errors: [error.message],
            payload: {}
          })
    }

    return response.json({
      errors: [],
      payload: updatedTenant
    })
  })
}

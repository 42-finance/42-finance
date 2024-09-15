import { Household, HouseholdUser, User, dataSource } from 'database'
import { UserPermission } from 'shared-types'
import { EntityManager } from 'typeorm'

import { createDefaultCategories } from './category.utils'

export const createHousehold = async (user: User, entityManager: EntityManager = dataSource.manager) => {
  const household = await entityManager.getRepository(Household).save({
    name: `${user.name}'s Household`
  })
  await entityManager.getRepository(HouseholdUser).save({
    userId: user.id,
    householdId: household.id,
    permission: UserPermission.Owner
  })
  await createDefaultCategories(household.id, entityManager)
  return household
}

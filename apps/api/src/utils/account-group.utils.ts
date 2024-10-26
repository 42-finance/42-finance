import { AccountGroup, dataSource } from 'database'
import { mapAccountGroupType } from 'frontend-utils'
import { AccountGroupType } from 'shared-types'
import { EntityManager } from 'typeorm'

export const createDefaultAccountGroups = async (
  householdId: number,
  entityManager: EntityManager = dataSource.manager
) => {
  for (const type of Object.values(AccountGroupType)) {
    await entityManager.getRepository(AccountGroup).insert({
      name: mapAccountGroupType(type),
      type,
      householdId
    })
  }
}

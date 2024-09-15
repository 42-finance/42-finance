import { Category, Group, dataSource } from 'database'
import { CategoryType, SystemCategory } from 'shared-types'
import { EntityManager } from 'typeorm'

import { readJsonFile } from './json.utils'

type GroupJson = {
  name: string
  type: CategoryType
  icon: string
  categories: CategoryJson[]
}

type CategoryJson = {
  name: string
  systemCategory: SystemCategory
  icon: string
}

export const createDefaultCategories = async (
  householdId: number,
  entityManager: EntityManager = dataSource.manager
) => {
  const groupsJson: GroupJson[] = readJsonFile('src/assets/data/categories.json')

  for (const groupJson of groupsJson) {
    const group = await entityManager.getRepository(Group).save({
      name: groupJson.name,
      type: groupJson.type,
      icon: groupJson.icon,
      householdId
    })

    for (const categoryJson of groupJson.categories) {
      await entityManager.getRepository(Category).save({
        name: categoryJson.name,
        systemCategory: categoryJson.systemCategory,
        icon: categoryJson.icon,
        groupId: group.id,
        householdId
      })
    }
  }
}

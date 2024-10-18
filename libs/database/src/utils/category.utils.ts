import { SystemCategory } from 'shared-types'

import { Category, Group, dataSource } from '..'

export const getCategory = async (systemCategory: SystemCategory, householdId: number) => {
  let category = await dataSource
    .getRepository(Category)
    .createQueryBuilder('category')
    .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
    .where('category.systemCategory = :systemCategory', { systemCategory })
    .andWhere('category.householdId = :householdId', { householdId })
    .getOneOrFail()

  let hasMapToCategory = category.mapToCategoryId != null

  while (hasMapToCategory) {
    category = await dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndMapOne('category.group', Group, 'group', 'group.id = category.groupId')
      .where('category.id = :mapToCategoryId', { mapToCategoryId: category.mapToCategoryId })
      .andWhere('category.householdId = :householdId', { householdId })
      .getOneOrFail()
    hasMapToCategory = category.mapToCategoryId != null
  }

  return category
}

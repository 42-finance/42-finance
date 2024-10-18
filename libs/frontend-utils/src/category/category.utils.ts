import { Category, Group } from 'frontend-types'

export type GroupedCategory<T> = {
  key: T
  categories: Category[]
}

export const groupCategoriesByGroup = (categories: Category[]) => {
  const sortedItems = categories.sort((a, b) => a.groupId - b.groupId)
  return sortedItems.reduce<GroupedCategory<Group>[]>((acc, category) => {
    const lastGroup = acc[acc.length - 1]
    if (lastGroup && lastGroup.key.id === category.groupId) {
      lastGroup.categories.push(category)
    } else {
      acc.push({ key: category.group, categories: [category] })
    }
    return acc
  }, [])
}

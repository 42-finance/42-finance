import { BudgetType, CategoryType } from 'shared-types'

import { Category } from './category.type'

export type Group = {
  id: number
  name: string
  type: CategoryType
  icon: string
  budgetType: BudgetType
  hideFromBudget: boolean
  rolloverBudget: boolean
  categories: Category[]
}
